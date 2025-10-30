import { query } from '../db/connection';
import { User } from '../types';
import bcrypt from 'bcrypt';

export class UserModel {
  static async findById(id: string): Promise<User | null> {
    const result = await query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  static async findAll(filters?: {
    companyId?: string;
    role?: string;
    isActive?: boolean;
  }): Promise<User[]> {
    let sql = 'SELECT * FROM users WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.companyId) {
      sql += ` AND company_id = $${paramCount++}`;
      params.push(filters.companyId);
    }
    if (filters?.role) {
      sql += ` AND role = $${paramCount++}`;
      params.push(filters.role);
    }
    if (filters?.isActive !== undefined) {
      sql += ` AND is_active = $${paramCount++}`;
      params.push(filters.isActive);
    }

    sql += ' ORDER BY created_at DESC';

    const result = await query(sql, params);
    return result.rows.map(this.mapRow);
  }

  static async create(data: {
    email: string;
    password: string;
    role: 'admin' | 'manager' | 'rep';
    firstName?: string;
    lastName?: string;
    phone?: string;
    companyId?: string;
  }): Promise<User> {
    const passwordHash = await bcrypt.hash(data.password, 10);

    const result = await query(
      `INSERT INTO users (email, password_hash, role, first_name, last_name, phone, company_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [data.email, passwordHash, data.role, data.firstName, data.lastName, data.phone, data.companyId]
    );

    return this.mapRow(result.rows[0]);
  }

  static async update(id: string, data: Partial<User>): Promise<User | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.firstName !== undefined) {
      fields.push(`first_name = $${paramCount++}`);
      values.push(data.firstName);
    }
    if (data.lastName !== undefined) {
      fields.push(`last_name = $${paramCount++}`);
      values.push(data.lastName);
    }
    if (data.phone !== undefined) {
      fields.push(`phone = $${paramCount++}`);
      values.push(data.phone);
    }
    if (data.avatarUrl !== undefined) {
      fields.push(`avatar_url = $${paramCount++}`);
      values.push(data.avatarUrl);
    }
    if (data.locale !== undefined) {
      fields.push(`locale = $${paramCount++}`);
      values.push(data.locale);
    }
    if (data.isActive !== undefined) {
      fields.push(`is_active = $${paramCount++}`);
      values.push(data.isActive);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  static async updatePassword(id: string, newPassword: string): Promise<void> {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [passwordHash, id]
    );
  }

  static async updateLastLogin(id: string): Promise<void> {
    await query(
      'UPDATE users SET last_login_at = NOW() WHERE id = $1',
      [id]
    );
  }

  static async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM users WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  static async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

  private static mapRow(row: any): User {
    return {
      id: row.id,
      companyId: row.company_id,
      email: row.email,
      passwordHash: row.password_hash,
      role: row.role,
      firstName: row.first_name,
      lastName: row.last_name,
      phone: row.phone,
      avatarUrl: row.avatar_url,
      locale: row.locale,
      isActive: row.is_active,
      lastLoginAt: row.last_login_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}



