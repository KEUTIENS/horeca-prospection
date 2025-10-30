import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { AppError } from '../middlewares/error-handler';
import { query } from '../db/connection';

export class StatsController {
  static async getOverview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { dateFrom, dateTo, userId } = req.query;

      // Non-admin users can only see their own stats
      let effectiveUserId = userId as string;
      if (req.user?.role === 'rep') {
        effectiveUserId = req.user.id;
      }

      let params: any[] = [];
      let paramCount = 1;
      let whereClause = 'WHERE 1=1';

      if (effectiveUserId) {
        whereClause += ` AND user_id = $${paramCount++}`;
        params.push(effectiveUserId);
      }
      if (dateFrom) {
        whereClause += ` AND visited_at >= $${paramCount++}`;
        params.push(new Date(dateFrom as string));
      }
      if (dateTo) {
        whereClause += ` AND visited_at <= $${paramCount++}`;
        params.push(new Date(dateTo as string));
      }

      // Total visits
      const visitsResult = await query(
        `SELECT COUNT(*) as total, AVG(score) as avg_score 
         FROM visits ${whereClause}`,
        params
      );

      // Visits by week
      const weeklyResult = await query(
        `SELECT DATE_TRUNC('week', visited_at) as week, COUNT(*) as count
         FROM visits ${whereClause}
         GROUP BY week
         ORDER BY week DESC
         LIMIT 12`,
        params
      );

      // Conversion rate
      const conversionResult = await query(
        `SELECT 
           COUNT(*) FILTER (WHERE status = 'converted') as converted,
           COUNT(*) as total
         FROM prospects
         WHERE company_id = $1`,
        [req.user?.companyId]
      );

      // Top prospects by score
      const topProspectsResult = await query(
        `SELECT id, name, note_avg, visits_count
         FROM prospects
         WHERE company_id = $1 AND note_avg > 0
         ORDER BY note_avg DESC, visits_count DESC
         LIMIT 10`,
        [req.user?.companyId]
      );

      res.json({
        status: 'success',
        data: {
          totalVisits: parseInt(visitsResult.rows[0].total) || 0,
          avgScore: parseFloat(visitsResult.rows[0].avg_score) || 0,
          weeklyVisits: weeklyResult.rows,
          conversionRate: conversionResult.rows[0].total > 0
            ? (conversionResult.rows[0].converted / conversionResult.rows[0].total) * 100
            : 0,
          topProspects: topProspectsResult.rows
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getConversions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { dateFrom, dateTo } = req.query;

      let params: any[] = [req.user?.companyId];
      let paramCount = 2;
      let whereClause = 'WHERE company_id = $1';

      if (dateFrom) {
        whereClause += ` AND created_at >= $${paramCount++}`;
        params.push(new Date(dateFrom as string));
      }
      if (dateTo) {
        whereClause += ` AND created_at <= $${paramCount++}`;
        params.push(new Date(dateTo as string));
      }

      const result = await query(
        `SELECT 
           status,
           COUNT(*) as count
         FROM prospects ${whereClause}
         GROUP BY status`,
        params
      );

      res.json({
        status: 'success',
        data: { conversions: result.rows }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getHeatmap(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { bbox } = req.query;

      // Get prospects with visit counts
      const result = await query(
        `SELECT 
           p.id,
           p.name,
           p.latitude,
           p.longitude,
           p.visits_count,
           p.note_avg
         FROM prospects p
         WHERE p.company_id = $1 
           AND p.latitude IS NOT NULL 
           AND p.longitude IS NOT NULL
         ORDER BY p.visits_count DESC`,
        [req.user?.companyId]
      );

      res.json({
        status: 'success',
        data: { locations: result.rows }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getByUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { dateFrom, dateTo } = req.query;

      let params: any[] = [req.user?.companyId];
      let paramCount = 2;
      let whereClause = 'WHERE u.company_id = $1';

      if (dateFrom) {
        whereClause += ` AND v.visited_at >= $${paramCount++}`;
        params.push(new Date(dateFrom as string));
      }
      if (dateTo) {
        whereClause += ` AND v.visited_at <= $${paramCount++}`;
        params.push(new Date(dateTo as string));
      }

      const result = await query(
        `SELECT 
           u.id,
           u.first_name,
           u.last_name,
           u.email,
           COUNT(v.id) as total_visits,
           AVG(v.score) as avg_score
         FROM users u
         LEFT JOIN visits v ON v.user_id = u.id ${dateFrom || dateTo ? 'AND ' + whereClause.split('WHERE u.company_id = $1 AND ')[1] : ''}
         ${whereClause}
         GROUP BY u.id, u.first_name, u.last_name, u.email
         ORDER BY total_visits DESC`,
        params
      );

      res.json({
        status: 'success',
        data: { userStats: result.rows }
      });
    } catch (error) {
      next(error);
    }
  }
}



