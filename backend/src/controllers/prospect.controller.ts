import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { AppError } from '../middlewares/error-handler';
import { ProspectModel } from '../models/prospect.model';
import { VisitModel } from '../models/visit.model';
import { logger } from '../utils/logger';

export class ProspectController {
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        q,
        type,
        status,
        city,
        minScore,
        lat,
        lng,
        radius,
        limit = 50,
        page = 1
      } = req.query;

      const offset = (Number(page) - 1) * Number(limit);

      const { prospects, total } = await ProspectModel.findAll({
        companyId: req.user?.companyId,
        type: type as any,
        status: status as any,
        city: city as string,
        searchTerm: q as string,
        minScore: minScore ? Number(minScore) : undefined,
        latitude: lat ? Number(lat) : undefined,
        longitude: lng ? Number(lng) : undefined,
        radiusKm: radius ? Number(radius) : undefined,
        limit: Number(limit),
        offset
      });

      res.json({
        status: 'success',
        data: {
          prospects,
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

      const prospect = await ProspectModel.findById(id);
      if (!prospect) {
        throw new AppError('Prospect not found', 404);
      }

      // Get visits history
      const visits = await VisitModel.getByProspect(id);

      res.json({
        status: 'success',
        data: {
          prospect,
          visits
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const prospectData = {
        ...req.body,
        companyId: req.user?.companyId,
        createdBy: req.user?.id
      };

      const prospect = await ProspectModel.create(prospectData);

      logger.info(`Prospect created: ${prospect.name} by ${req.user?.email}`);

      res.status(201).json({
        status: 'success',
        data: { prospect }
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existing = await ProspectModel.findById(id);
      if (!existing) {
        throw new AppError('Prospect not found', 404);
      }

      const prospect = await ProspectModel.update(id, req.body);

      logger.info(`Prospect updated: ${id} by ${req.user?.email}`);

      res.json({
        status: 'success',
        data: { prospect }
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existing = await ProspectModel.findById(id);
      if (!existing) {
        throw new AppError('Prospect not found', 404);
      }

      await ProspectModel.delete(id);

      logger.info(`Prospect deleted: ${id} by ${req.user?.email}`);

      res.json({
        status: 'success',
        message: 'Prospect deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async getNearby(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { lat, lng, radius = 5, limit = 20 } = req.query;

      if (!lat || !lng) {
        throw new AppError('Latitude and longitude required', 400);
      }

      const prospects = await ProspectModel.getNearby(
        Number(lat),
        Number(lng),
        Number(radius),
        Number(limit)
      );

      res.json({
        status: 'success',
        data: { prospects }
      });
    } catch (error) {
      next(error);
    }
  }

  static async enrich(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const prospect = await ProspectModel.findById(id);
      if (!prospect) {
        throw new AppError('Prospect not found', 404);
      }

      // TODO: Queue AI enrichment job
      // This would trigger the worker to enrich the prospect

      logger.info(`AI enrichment queued for prospect: ${id}`);

      res.json({
        status: 'success',
        message: 'Enrichment queued successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}



