import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { AppError } from '../middlewares/error-handler';
import { UserModel } from '../models/user.model';
import { logger } from '../utils/logger';

export class UserController {
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { role, isActive } = req.query;

      const users = await UserModel.findAll({
        companyId: req.user?.companyId,
        role: role as any,
        isActive: isActive ? isActive === 'true' : undefined
      });

      // Remove password hashes
      const usersWithoutPasswords = users.map(({ passwordHash, ...user }) => user);

      res.json({
        status: 'success',
        data: { users: usersWithoutPasswords }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const user = await UserModel.findById(id);
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

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, password, role, firstName, lastName, phone } = req.body;

      if (!email || !password || !role) {
        throw new AppError('Email, password, and role are required', 400);
      }

      // Check if user already exists
      const existing = await UserModel.findByEmail(email);
      if (existing) {
        throw new AppError('User with this email already exists', 400);
      }

      const user = await UserModel.create({
        email,
        password,
        role,
        firstName,
        lastName,
        phone,
        companyId: req.user?.companyId
      });

      logger.info(`User created: ${email} by ${req.user?.email}`);

      const { passwordHash, ...userWithoutPassword } = user;

      res.status(201).json({
        status: 'success',
        data: { user: userWithoutPassword }
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existing = await UserModel.findById(id);
      if (!existing) {
        throw new AppError('User not found', 404);
      }

      const user = await UserModel.update(id, req.body);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      logger.info(`User updated: ${id} by ${req.user?.email}`);

      const { passwordHash, ...userWithoutPassword } = user;

      res.json({
        status: 'success',
        data: { user: userWithoutPassword }
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (id === req.user?.id) {
        throw new AppError('Cannot delete your own account', 400);
      }

      const existing = await UserModel.findById(id);
      if (!existing) {
        throw new AppError('User not found', 404);
      }

      await UserModel.delete(id);

      logger.info(`User deleted: ${id} by ${req.user?.email}`);

      res.json({
        status: 'success',
        message: 'User deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}



