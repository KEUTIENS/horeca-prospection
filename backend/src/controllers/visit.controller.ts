import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { AppError } from '../middlewares/error-handler';
import { VisitModel } from '../models/visit.model';
import { ProspectModel } from '../models/prospect.model';
import { logger } from '../utils/logger';

export class VisitController {
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        prospectId,
        userId,
        tourId,
        dateFrom,
        dateTo,
        minScore,
        limit = 50,
        page = 1
      } = req.query;

      // Non-admin users can only see their own visits
      let effectiveUserId = userId as string;
      if (req.user?.role === 'rep' && !userId) {
        effectiveUserId = req.user.id;
      }

      const offset = (Number(page) - 1) * Number(limit);

      const { visits, total } = await VisitModel.findAll({
        prospectId: prospectId as string,
        userId: effectiveUserId,
        tourId: tourId as string,
        dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
        dateTo: dateTo ? new Date(dateTo as string) : undefined,
        minScore: minScore ? Number(minScore) : undefined,
        limit: Number(limit),
        offset
      });

      res.json({
        status: 'success',
        data: {
          visits,
          pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(total / Number(limit))
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const visit = await VisitModel.findById(id);
      if (!visit) {
        throw new AppError('Visit not found', 404);
      }

      // Check permissions
      if (req.user?.role === 'rep' && visit.userId !== req.user.id) {
        throw new AppError('Forbidden', 403);
      }

      res.json({
        status: 'success',
        data: { visit }
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { prospectId, tourId, visitedAt, durationMinutes, objective, summary, score, signedBy, signatureData } = req.body;

      if (!prospectId || !visitedAt) {
        throw new AppError('Prospect ID and visited date are required', 400);
      }

      // Verify prospect exists
      const prospect = await ProspectModel.findById(prospectId);
      if (!prospect) {
        throw new AppError('Prospect not found', 404);
      }

      const visit = await VisitModel.create({
        prospectId,
        userId: req.user!.id,
        tourId,
        visitedAt: new Date(visitedAt),
        durationMinutes,
        objective,
        summary,
        score,
        signedBy,
        signatureData
      });

      logger.info(`Visit created for prospect ${prospectId} by ${req.user?.email}`);

      res.status(201).json({
        status: 'success',
        data: { visit }
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existing = await VisitModel.findById(id);
      if (!existing) {
        throw new AppError('Visit not found', 404);
      }

      // Check permissions
      if (req.user?.role === 'rep' && existing.userId !== req.user.id) {
        throw new AppError('Forbidden', 403);
      }

      const visit = await VisitModel.update(id, req.body);

      logger.info(`Visit updated: ${id} by ${req.user?.email}`);

      res.json({
        status: 'success',
        data: { visit }
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existing = await VisitModel.findById(id);
      if (!existing) {
        throw new AppError('Visit not found', 404);
      }

      // Check permissions
      if (req.user?.role === 'rep' && existing.userId !== req.user.id) {
        throw new AppError('Forbidden', 403);
      }

      await VisitModel.delete(id);

      logger.info(`Visit deleted: ${id} by ${req.user?.email}`);

      res.json({
        status: 'success',
        message: 'Visit deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { userId, dateFrom, dateTo } = req.query;

      // Non-admin users can only see their own stats
      let effectiveUserId = userId as string;
      if (req.user?.role === 'rep') {
        effectiveUserId = req.user.id;
      }

      const stats = await VisitModel.getStats({
        userId: effectiveUserId,
        dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
        dateTo: dateTo ? new Date(dateTo as string) : undefined
      });

      res.json({
        status: 'success',
        data: { stats }
      });
    } catch (error) {
      next(error);
    }
  }
}



