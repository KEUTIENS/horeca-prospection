import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { AppError } from '../middlewares/error-handler';
import { TourModel } from '../models/tour.model';
import { ProspectModel } from '../models/prospect.model';
import { logger } from '../utils/logger';

export class TourController {
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { userId, date, status, dateFrom, dateTo } = req.query;

      // Non-admin users can only see their own tours
      let effectiveUserId = userId as string;
      if (req.user?.role === 'rep') {
        effectiveUserId = req.user.id;
      }

      const tours = await TourModel.findAll({
        userId: effectiveUserId,
        companyId: req.user?.companyId,
        date: date ? new Date(date as string) : undefined,
        status: status as any,
        dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
        dateTo: dateTo ? new Date(dateTo as string) : undefined
      });

      res.json({
        status: 'success',
        data: { tours }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const tour = await TourModel.findById(id);
      if (!tour) {
        throw new AppError('Tour not found', 404);
      }

      // Check permissions
      if (req.user?.role === 'rep' && tour.userId !== req.user.id) {
        throw new AppError('Forbidden', 403);
      }

      // Get steps with prospect details
      const steps = await TourModel.getSteps(id);
      const stepsWithProspects = await Promise.all(
        steps.map(async (step) => {
          const prospect = await ProspectModel.findById(step.prospectId);
          return { ...step, prospect };
        })
      );

      res.json({
        status: 'success',
        data: {
          tour,
          steps: stepsWithProspects
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, date, prospectIds } = req.body;

      if (!date) {
        throw new AppError('Date is required', 400);
      }

      if (!prospectIds || !Array.isArray(prospectIds) || prospectIds.length === 0) {
        throw new AppError('At least one prospect is required', 400);
      }

      // Create tour
      const tour = await TourModel.create({
        userId: req.user!.id,
        companyId: req.user?.companyId,
        name,
        date: new Date(date)
      });

      // Add steps
      await TourModel.addSteps(tour.id, prospectIds);

      logger.info(`Tour created: ${tour.id} by ${req.user?.email}`);

      // Return tour with steps
      const steps = await TourModel.getSteps(tour.id);
      const stepsWithProspects = await Promise.all(
        steps.map(async (step) => {
          const prospect = await ProspectModel.findById(step.prospectId);
          return { ...step, prospect };
        })
      );

      res.status(201).json({
        status: 'success',
        data: {
          tour,
          steps: stepsWithProspects
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existing = await TourModel.findById(id);
      if (!existing) {
        throw new AppError('Tour not found', 404);
      }

      // Check permissions
      if (req.user?.role === 'rep' && existing.userId !== req.user.id) {
        throw new AppError('Forbidden', 403);
      }

      const tour = await TourModel.update(id, req.body);

      logger.info(`Tour updated: ${id} by ${req.user?.email}`);

      res.json({
        status: 'success',
        data: { tour }
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existing = await TourModel.findById(id);
      if (!existing) {
        throw new AppError('Tour not found', 404);
      }

      // Check permissions
      if (req.user?.role === 'rep' && existing.userId !== req.user.id) {
        throw new AppError('Forbidden', 403);
      }

      await TourModel.delete(id);

      logger.info(`Tour deleted: ${id} by ${req.user?.email}`);

      res.json({
        status: 'success',
        message: 'Tour deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async start(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const tour = await TourModel.findById(id);
      if (!tour) {
        throw new AppError('Tour not found', 404);
      }

      // Check permissions
      if (req.user?.role === 'rep' && tour.userId !== req.user.id) {
        throw new AppError('Forbidden', 403);
      }

      if (tour.status !== 'planned') {
        throw new AppError('Tour already started or completed', 400);
      }

      await TourModel.update(id, { status: 'in_progress' });

      logger.info(`Tour started: ${id} by ${req.user?.email}`);

      res.json({
        status: 'success',
        message: 'Tour started successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async complete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const tour = await TourModel.findById(id);
      if (!tour) {
        throw new AppError('Tour not found', 404);
      }

      // Check permissions
      if (req.user?.role === 'rep' && tour.userId !== req.user.id) {
        throw new AppError('Forbidden', 403);
      }

      await TourModel.update(id, { status: 'completed' });

      logger.info(`Tour completed: ${id} by ${req.user?.email}`);

      res.json({
        status: 'success',
        message: 'Tour completed successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStep(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id, stepId } = req.params;

      const tour = await TourModel.findById(id);
      if (!tour) {
        throw new AppError('Tour not found', 404);
      }

      // Check permissions
      if (req.user?.role === 'rep' && tour.userId !== req.user.id) {
        throw new AppError('Forbidden', 403);
      }

      const step = await TourModel.updateStep(stepId, req.body);

      logger.info(`Tour step updated: ${stepId} by ${req.user?.email}`);

      res.json({
        status: 'success',
        data: { step }
      });
    } catch (error) {
      next(error);
    }
  }
}



