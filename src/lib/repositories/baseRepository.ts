import { getDb } from "../db";

export class BaseRepository<T> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async getAll(): Promise<T[]> {
    const db = await getDb();
    return await db.select<T[]>(`SELECT * FROM ${this.tableName}`);
  }

  async getById(id: number): Promise<T | null> {
    const db = await getDb();
    const results = await db.select<T[]>(
      `SELECT * FROM ${this.tableName} WHERE id = $1`,
      [id]
    );
    return results.length > 0 ? results[0] : null;
  }

  async delete(id: number): Promise<void> {
    const db = await getDb();
    await db.execute(`DELETE FROM ${this.tableName} WHERE id = $1`, [id]);
  }
}
