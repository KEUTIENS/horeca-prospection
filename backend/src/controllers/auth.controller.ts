import { Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthRequest } from '../middlewares/auth';
import { AppError } from '../middlewares/error-handler';
import { UserModel } from '../models/user.model';
import { query } from '../db/connection';
import { logger } from '../utils/logger';

export class AuthController {
  static async login(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError('Email and password are required', 400);
      }

      const user = await UserModel.findByEmail(email);
      if (!user) {
        throw new AppError('Invalid credentials', 401);
      }

      if (!user.isActive) {
        throw new AppError('Account is disabled', 403);
      }

      const isValidPassword = await UserModel.verifyPassword(user, password);
      if (!isValidPassword) {
        throw new AppError('Invalid credentials', 401);
      }

      // Generate tokens
      const jwtSecret = (process.env.JWT_SECRET || 'default-secret-key') as jwt.Secret;
      const jwtRefreshSecret = (process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-key') as jwt.Secret;
      
      const accessToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          companyId: user.companyId
        },
        jwtSecret,
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m' } as jwt.SignOptions
      );

      const refreshToken = jwt.sign(
        { id: user.id },
        jwtRefreshSecret,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' } as jwt.SignOptions
      );

      // Store refresh token
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      await query(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
        [user.id, refreshToken, expiresAt]
      );

      // Update last login
      await UserModel.updateLastLogin(user.id);

      logger.info(`User logged in: ${user.email}`);

      res.json({
        status: 'success',
        data: {
          accessToken,
          refreshToken,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            avatarUrl: user.avatarUrl
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new AppError('Refresh token required', 400);
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: string };

      // Check if token exists in database
      const tokenResult = await query(
        'SELECT * FROM refresh_tokens WHERE user_id = $1 AND token = $2 AND expires_at > NOW()',
        [decoded.id, refreshToken]
      );

      if (tokenResult.rows.length === 0) {
        throw new AppError('Invalid refresh token', 401);
      }

      // Get user
      const user = await UserModel.findById(decoded.id);
      if (!user || !user.isActive) {
        throw new AppError('Invalid user', 401);
      }

      // Generate new access token
      const jwtSecret = (process.env.JWT_SECRET || 'default-secret-key') as jwt.Secret;
      
      const accessToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          companyId: user.companyId
        },
        jwtSecret,
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m' } as jwt.SignOptions
      );

      res.json({
        status: 'success',
        data: { accessToken }
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      if (refreshToken) {
        await query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
      }

      res.json({
        status: 'success',
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const user = await UserModel.findById(req.user.id);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      const { passwordHash, ...userWithoutPassword } = user;

      res.json({
        status: 'success',
        data: { user: userWithoutPassword }
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const { firstName, lastName, phone, locale, avatarUrl } = req.body;

      const updatedUser = await UserModel.update(req.user.id, {
        firstName,
        lastName,
        phone,
        locale,
        avatarUrl
      });

      if (!updatedUser) {
        throw new AppError('User not found', 404);
      }

      const { passwordHash, ...userWithoutPassword } = updatedUser;

      res.json({
        status: 'success',
        data: { user: userWithoutPassword }
      });
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        throw new AppError('Current and new password required', 400);
      }

      const user = await UserModel.findById(req.user.id);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      const isValid = await UserModel.verifyPassword(user, currentPassword);
      if (!isValid) {
        throw new AppError('Invalid current password', 401);
      }

      await UserModel.updatePassword(user.id, newPassword);

      logger.info(`Password changed for user: ${user.email}`);

      res.json({
        status: 'success',
        message: 'Password updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}



