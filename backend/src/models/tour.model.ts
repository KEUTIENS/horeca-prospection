import { query, getClient } from '../db/connection';
import { Tour, TourStep, TourStatus } from '../types';

export class TourModel {
  static async findById(id: string): Promise<Tour | null> {
    const result = await query(
      'SELECT * FROM tours WHERE id = $1',
      [id]
    );
    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  static async findAll(filters?: {
    userId?: string;
    companyId?: string;
    date?: Date;
    status?: TourStatus;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<Tour[]> {
    let sql = 'SELECT * FROM tours WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.userId) {
      sql += ` AND user_id = $${paramCount++}`;
      params.push(filters.userId);
    }
    if (filters?.companyId) {
      sql += ` AND company_id = $${paramCount++}`;
      params.push(filters.companyId);
    }
    if (filters?.date) {
      sql += ` AND date = $${paramCount++}`;
      params.push(filters.date);
    }
    if (filters?.status) {
      sql += ` AND status = $${paramCount++}`;
      params.push(filters.status);
    }
    if (filters?.dateFrom) {
      sql += ` AND date >= $${paramCount++}`;
      params.push(filters.dateFrom);
    }
    if (filters?.dateTo) {
      sql += ` AND date <= $${paramCount++}`;
      params.push(filters.dateTo);
    }

    sql += ' ORDER BY date DESC, created_at DESC';

    const result = await query(sql, params);
    return result.rows.map(this.mapRow);
  }

  static async create(data: {
    userId: string;
    companyId?: string;
    name?: string;
    date: Date;
    status?: TourStatus;
  }): Promise<Tour> {
    const result = await query(
      `INSERT INTO tours (user_id, company_id, name, date, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.userId, data.companyId, data.name, data.date, data.status || 'planned']
    );

    return this.mapRow(result.rows[0]);
  }

  static async update(id: string, data: Partial<Tour>): Promise<Tour | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    const fieldMappings: { [key: string]: string } = {
      name: 'name',
      date: 'date',
      status: 'status',
      totalDistanceKm: 'total_distance_km',
      totalDurationMinutes: 'total_duration_minutes',
      routeData: 'route_data'
    };

    Object.entries(data).forEach(([key, value]) => {
      if (fieldMappings[key] && value !== undefined) {
        fields.push(`${fieldMappings[key]} = $${paramCount++}`);
        values.push(typeof value === 'object' && value !== null ? JSON.stringify(value) : value);
      }
    });

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await query(
      `UPDATE tours SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM tours WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  static async getSteps(tourId: string): Promise<TourStep[]> {
    const result = await query(
      'SELECT * FROM tour_steps WHERE tour_id = $1 ORDER BY step_order',
      [tourId]
    );
    return result.rows.map(this.mapStepRow);
  }

  static async addSteps(tourId: string, prospectIds: string[]): Promise<TourStep[]> {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      const steps: TourStep[] = [];
      for (let i = 0; i < prospectIds.length; i++) {
        const result = await client.query(
          `INSERT INTO tour_steps (tour_id, prospect_id, step_order)
           VALUES ($1, $2, $3)
           RETURNING *`,
          [tourId, prospectIds[i], i + 1]
        );
        steps.push(this.mapStepRow(result.rows[0]));
      }

      await client.query('COMMIT');
      return steps;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async updateStep(stepId: string, data: Partial<TourStep>): Promise<TourStep | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    const fieldMappings: { [key: string]: string } = {
      stepOrder: 'step_order',
      eta: 'eta',
      distanceFromPreviousKm: 'distance_from_previous_km',
      durationFromPreviousMinutes: 'duration_from_previous_minutes',
      status: 'status',
      completedAt: 'completed_at'
    };

    Object.entries(data).forEach(([key, value]) => {
      if (fieldMappings[key] && value !== undefined) {
        fields.push(`${fieldMappings[key]} = $${paramCount++}`);
        values.push(value);
      }
    });

    if (fields.length === 0) {
      return null;
    }

    values.push(stepId);
    const result = await query(
      `UPDATE tour_steps SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] ? this.mapStepRow(result.rows[0]) : null;
  }

  static async deleteStep(stepId: string): Promise<boolean> {
    const result = await query('DELETE FROM tour_steps WHERE id = $1', [stepId]);
    return result.rowCount > 0;
  }

  private static mapRow(row: any): Tour {
    return {
      id: row.id,
      userId: row.user_id,
      companyId: row.company_id,
      name: row.name,
      date: row.date,
      status: row.status,
      totalDistanceKm: row.total_distance_km ? parseFloat(row.total_distance_km) : undefined,
      totalDurationMinutes: row.total_duration_minutes,
      routeData: row.route_data,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private static mapStepRow(row: any): TourStep {
    return {
      id: row.id,
      tourId: row.tour_id,
      prospectId: row.prospect_id,
      stepOrder: row.step_order,
      eta: row.eta,
      distanceFromPreviousKm: row.distance_from_previous_km ? parseFloat(row.distance_from_previous_km) : undefined,
      durationFromPreviousMinutes: row.duration_from_previous_minutes,
      status: row.status,
      completedAt: row.completed_at,
      createdAt: row.created_at
    };
  }
}



