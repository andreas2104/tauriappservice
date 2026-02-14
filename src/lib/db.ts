import Database from "@tauri-apps/plugin-sql";

let db: Database | null = null;

export async function getDb(): Promise<Database> {
  if (!db) {
    // This will create a 'sqlite.db' file in the app data directory
    // or use it if it already exists.
    db = await Database.load("sqlite:sqlite.db");
    
    // Initialize schema if needed
    await db.execute(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT 0
      )
    `);
  }
  return db;
}
