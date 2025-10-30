import { query } from '../db/connection';
import { Visit } from '../types';

export class VisitModel {
  static async findById(id: string): Promise<Visit | null> {
    const result = await query(
      'SELECT * FROM visits WHERE id = $1',
      [id]
    );
    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  static async findAll(filters?: {
    prospectId?: string;
    userId?: string;
    tourId?: string;
    dateFrom?: Date;
    dateTo?: Date;
    minScore?: number;
    limit?: number;
    offset?: number;
  }): Promise<{ visits: Visit[]; total: number }> {
    let sql = 'SELECT * FROM visits WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.prospectId) {
      sql += ` AND prospect_id = $${paramCount++}`;
      params.push(filters.prospectId);
    }
    if (filters?.userId) {
      sql += ` AND user_id = $${paramCount++}`;
      params.push(filters.userId);
    }
    if (filters?.tourId) {
      sql += ` AND tour_id = $${paramCount++}`;
      params.push(filters.tourId);
    }
    if (filters?.dateFrom) {
      sql += ` AND visited_at >= $${paramCount++}`;
      params.push(filters.dateFrom);
    }
    if (filters?.dateTo) {
      sql += ` AND visited_at <= $${paramCount++}`;
      params.push(filters.dateTo);
    }
    if (filters?.minScore !== undefined) {
      sql += ` AND score >= $${paramCount++}`;
      params.push(filters.minScore);
    }

    // Count total
    const countResult = await query(sql.replace('SELECT *', 'SELECT COUNT(*)'), params);
    const total = parseInt(countResult.rows[0].count);

    sql += ' ORDER BY visited_at DESC';

    if (filters?.limit) {
      sql += ` LIMIT $${paramCount++}`;
      params.push(filters.limit);
    }
    if (filters?.offset) {
      sql += ` OFFSET $${paramCount++}`;
      params.push(filters.offset);
    }

    const result = await query(sql, params);
    return {
      visits: result.rows.map(this.mapRow),
      total
    };
  }

  static async create(data: {
    prospectId: string;
    userId: string;
    tourId?: string;
    visitedAt: Date;
    durationMinutes?: number;
    objective?: string;
    summary?: string;
    score?: number;
    signedBy?: string;
    signatureData?: string;
  }): Promise<Visit> {
    const result = await query(
      `INSERT INTO visits (
        prospect_id, user_id, tour_id, visited_at, duration_minutes,
        objective, summary, score, signed_by, signature_data
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        data.prospectId, data.userId, data.tourId, data.visitedAt,
        data.durationMinutes, data.objective, data.summary, data.score,
        data.signedBy, data.signatureData
      ]
    );

    return this.mapRow(result.rows[0]);
  }

  static async update(id: string, data: Partial<Visit>): Promise<Visit | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    const fieldMappings: { [key: string]: string } = {
      visitedAt: 'visited_at',
      durationMinutes: 'duration_minutes',
      objective: 'objective',
      summary: 'summary',
      score: 'score',
      signedBy: 'signed_by',
      signatureData: 'signature_data'
    };

    Object.entries(data).forEach(([key, value]) => {
      if (fieldMappings[key] && value !== undefined) {
        fields.push(`${fieldMappings[key]} = $${paramCount++}`);
        values.push(value);
      }
    });

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await query(
      `UPDATE visits SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM visits WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  static async getByProspect(prospectId: string): Promise<Visit[]> {
    const result = await query(
      'SELECT * FROM visits WHERE prospect_id = $1 ORDER BY visited_at DESC',
      [prospectId]
    );
    return result.rows.map(this.mapRow);
  }

  static async getStats(filters?: {
    userId?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<{
    total: number;
    avgScore: number;
    avgDuration: number;
    byScore: { score: number; count: number }[];
  }> {
    let sql = 'SELECT COUNT(*) as total, AVG(score) as avg_score, AVG(duration_minutes) as avg_duration FROM visits WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.userId) {
      sql += ` AND user_id = $${paramCount++}`;
      params.push(filters.userId);
    }
    if (filters?.dateFrom) {
      sql += ` AND visited_at >= $${paramCount++}`;
      params.push(filters.dateFrom);
    }
    if (filters?.dateTo) {
      sql += ` AND visited_at <= $${paramCount++}`;
      params.push(filters.dateTo);
    }

    const result = await query(sql, params);
    
    // Get score distribution
    let scoreSql = 'SELECT score, COUNT(*) as count FROM visits WHERE score IS NOT NULL';
    const scoreParams: any[] = [];
    let scoreParamCount = 1;

    if (filters?.userId) {
      scoreSql += ` AND user_id = $${scoreParamCount++}`;
      scoreParams.push(filters.userId);
    }
    if (filters?.dateFrom) {
      scoreSql += ` AND visited_at >= $${scoreParamCount++}`;
      scoreParams.push(filters.dateFrom);
    }
    if (filters?.dateTo) {
      scoreSql += ` AND visited_at <= $${scoreParamCount++}`;
      scoreParams.push(filters.dateTo);
    }

    scoreSql += ' GROUP BY score ORDER BY score';
    const scoreResult = await query(scoreSql, scoreParams);

    return {
      total: parseInt(result.rows[0].total) || 0,
      avgScore: parseFloat(result.rows[0].avg_score) || 0,
      avgDuration: parseFloat(result.rows[0].avg_duration) || 0,
      byScore: scoreResult.rows.map((r: any) => ({
        score: parseInt(r.score),
        count: parseInt(r.count)
      }))
    };
  }

  private static mapRow(row: any): Visit {
    return {
      id: row.id,
      prospectId: row.prospect_id,
      userId: row.user_id,
      tourId: row.tour_id,
      visitedAt: row.visited_at,
      durationMinutes: row.duration_minutes,
      objective: row.objective,
      summary: row.summary,
      score: row.score,
      signedBy: row.signed_by,
      signatureData: row.signature_data,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}



