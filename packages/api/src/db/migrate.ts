import { db } from './client.js';

const migrations = [
  // Organizations table
  `CREATE TABLE IF NOT EXISTS organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    plan TEXT DEFAULT 'free',
    created_at TEXT DEFAULT (datetime('now'))
  )`,

  // Apps table
  `CREATE TABLE IF NOT EXISTS apps (
    id TEXT PRIMARY KEY,
    org_id TEXT NOT NULL REFERENCES organizations(id),
    name TEXT NOT NULL,
    domain TEXT,
    settings TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`,

  // API keys table
  `CREATE TABLE IF NOT EXISTS api_keys (
    id TEXT PRIMARY KEY,
    org_id TEXT NOT NULL REFERENCES organizations(id),
    app_id TEXT REFERENCES apps(id),
    key_hash TEXT NOT NULL,
    prefix TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    last_used TEXT
  )`,

  // Add app_id column to existing feedback table (if not exists)
  // SQLite doesn't support IF NOT EXISTS for ALTER TABLE, so we catch errors
];

const addColumnMigrations = [
  `ALTER TABLE feedback ADD COLUMN app_id TEXT REFERENCES apps(id)`,
  `ALTER TABLE feedback ADD COLUMN metadata_json TEXT`,
];

async function migrate() {
  console.log('Running migrations...');

  for (const sql of migrations) {
    try {
      await db.execute(sql);
      console.log('✓', sql.substring(0, 60) + '...');
    } catch (e: any) {
      console.error('✗', e.message);
    }
  }

  for (const sql of addColumnMigrations) {
    try {
      await db.execute(sql);
      console.log('✓', sql);
    } catch (e: any) {
      if (e.message?.includes('duplicate column')) {
        console.log('⊘ Column already exists, skipping');
      } else {
        console.error('✗', e.message);
      }
    }
  }

  // Seed default org and app
  const orgId = 'org_ftp_default';
  const appId = 'app_mhj_default';

  try {
    await db.execute({
      sql: `INSERT OR IGNORE INTO organizations (id, name, email) VALUES (?, ?, ?)`,
      args: [orgId, 'For The People', 'sven.siertsema@gmail.com'],
    });
    console.log('✓ Default org created/exists');

    await db.execute({
      sql: `INSERT OR IGNORE INTO apps (id, org_id, name, domain) VALUES (?, ?, ?, ?)`,
      args: [appId, orgId, 'My Health Journey', 'myhealthjourney.nl'],
    });
    console.log('✓ Default app created/exists');

    // Assign existing feedback to default app
    const result = await db.execute({
      sql: `UPDATE feedback SET app_id = ? WHERE app_id IS NULL`,
      args: [appId],
    });
    console.log(`✓ Migrated ${result.rowsAffected} existing feedback items`);
  } catch (e: any) {
    console.error('Seed error:', e.message);
  }

  console.log('Migration complete!');
}

migrate();
