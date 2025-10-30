import { query } from '../db/connection';
import { Prospect, ProspectType, ProspectStatus } from '../types';

export class ProspectModel {
  static async findById(id: string): Promise<Prospect | null> {
    const result = await query(
      'SELECT * FROM prospects WHERE id = $1',
      [id]
    );
    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  static async findAll(filters?: {
    companyId?: string;
    type?: ProspectType;
    status?: ProspectStatus;
    city?: string;
    searchTerm?: string;
    minScore?: number;
    latitude?: number;
    longitude?: number;
    radiusKm?: number;
    limit?: number;
    offset?: number;
  }): Promise<{ prospects: Prospect[]; total: number }> {
    let sql = 'SELECT * FROM prospects WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.companyId) {
      sql += ` AND company_id = $${paramCount++}`;
      params.push(filters.companyId);
    }
    if (filters?.type) {
      sql += ` AND type = $${paramCount++}`;
      params.push(filters.type);
    }
    if (filters?.status) {
      sql += ` AND status = $${paramCount++}`;
      params.push(filters.status);
    }
    if (filters?.city) {
      sql += ` AND LOWER(city) = LOWER($${paramCount++})`;
      params.push(filters.city);
    }
    if (filters?.searchTerm) {
      sql += ` AND (LOWER(name) LIKE LOWER($${paramCount}) OR LOWER(city) LIKE LOWER($${paramCount}) OR LOWER(address) LIKE LOWER($${paramCount}))`;
      params.push(`%${filters.searchTerm}%`);
      paramCount++;
    }
    if (filters?.minScore !== undefined) {
      sql += ` AND note_avg >= $${paramCount++}`;
      params.push(filters.minScore);
    }
    if (filters?.latitude && filters?.longitude && filters?.radiusKm) {
      sql += ` AND ST_DWithin(geom, ST_SetSRID(ST_MakePoint($${paramCount}, $${paramCount + 1}), 4326)::geography, $${paramCount + 2})`;
      params.push(filters.longitude, filters.latitude, filters.radiusKm * 1000);
      paramCount += 3;
    }

    // Count total
    const countResult = await query(sql.replace('SELECT *', 'SELECT COUNT(*)'), params);
    const total = parseInt(countResult.rows[0].count);

    sql += ' ORDER BY created_at DESC';

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
      prospects: result.rows.map(this.mapRow),
      total
    };
  }

  static async create(data: {
    name: string;
    type?: ProspectType;
    address?: string;
    postalCode?: string;
    city?: string;
    country?: string;
    phone?: string;
    email?: string;
    website?: string;
    managerName?: string;
    openingHours?: any;
    latitude?: number;
    longitude?: number;
    companyId?: string;
    createdBy?: string;
  }): Promise<Prospect> {
    const result = await query(
      `INSERT INTO prospects (
        name, type, address, postal_code, city, country, phone, email, website,
        manager_name, opening_hours, latitude, longitude, geom, company_id, created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
        ${data.latitude && data.longitude ? 'ST_SetSRID(ST_MakePoint($13, $12), 4326)::geography' : 'NULL'},
        $14, $15)
      RETURNING *`,
      [
        data.name, data.type, data.address, data.postalCode, data.city,
        data.country || 'France', data.phone, data.email, data.website,
        data.managerName, data.openingHours ? JSON.stringify(data.openingHours) : null,
        data.latitude, data.longitude,
        data.companyId, data.createdBy
      ]
    );

    return this.mapRow(result.rows[0]);
  }

  static async update(id: string, data: Partial<Prospect>): Promise<Prospect | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    const fieldMappings: { [key: string]: string } = {
      name: 'name',
      type: 'type',
      address: 'address',
      postalCode: 'postal_code',
      city: 'city',
      country: 'country',
      phone: 'phone',
      email: 'email',
      website: 'website',
      managerName: 'manager_name',
      openingHours: 'opening_hours',
      status: 'status',
      latitude: 'latitude',
      longitude: 'longitude',
      googlePlaceId: 'google_place_id',
      source: 'source',
      aiScore: 'ai_score'
    };

    Object.entries(data).forEach(([key, value]) => {
      if (fieldMappings[key] && value !== undefined) {
        fields.push(`${fieldMappings[key]} = $${paramCount++}`);
        values.push(typeof value === 'object' && value !== null ? JSON.stringify(value) : value);
      }
    });

    // Update geom if lat/lng changed
    if (data.latitude !== undefined && data.longitude !== undefined) {
      fields.push(`geom = ST_SetSRID(ST_MakePoint($${paramCount}, $${paramCount - 1}), 4326)::geography`);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await query(
      `UPDATE prospects SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM prospects WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  static async getNearby(latitude: number, longitude: number, radiusKm: number = 5, limit: number = 20): Promise<Prospect[]> {
    const result = await query(
      `SELECT *, ST_Distance(geom, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) / 1000 as distance_km
       FROM prospects
       WHERE ST_DWithin(geom, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3)
       ORDER BY distance_km
       LIMIT $4`,
      [longitude, latitude, radiusKm * 1000, limit]
    );

    return result.rows.map(this.mapRow);
  }

  static async markAiEnriched(id: string, aiData: any, aiScore?: number): Promise<void> {
    await query(
      `UPDATE prospects 
       SET source = $1, ai_enriched_at = NOW(), ai_score = $2
       WHERE id = $3`,
      [JSON.stringify(aiData), aiScore, id]
    );
  }

  private static mapRow(row: any): Prospect {
    return {
      id: row.id,
      companyId: row.company_id,
      name: row.name,
      type: row.type,
      address: row.address,
      postalCode: row.postal_code,
      city: row.city,
      country: row.country,
      phone: row.phone,
      email: row.email,
      website: row.website,
      managerName: row.manager_name,
      openingHours: row.opening_hours,
      status: row.status,
      noteAvg: parseFloat(row.note_avg) || 0,
      visitsCount: parseInt(row.visits_count) || 0,
      latitude: row.latitude,
      longitude: row.longitude,
      googlePlaceId: row.google_place_id,
      source: row.source,
      aiEnrichedAt: row.ai_enriched_at,
      aiScore: row.ai_score ? parseFloat(row.ai_score) : undefined,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}



