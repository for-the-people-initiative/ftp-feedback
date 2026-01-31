import { Hono } from 'hono';
import { db } from '../db/client.js';
import { nanoid } from 'nanoid';

const app = new Hono();

// GET /v1/apps
app.get('/', async (c) => {
  const orgId = c.req.query('org_id');
  let sql = 'SELECT * FROM apps';
  const args: any[] = [];
  if (orgId) {
    sql += ' WHERE org_id = ?';
    args.push(orgId);
  }
  sql += ' ORDER BY created_at DESC';
  const result = await db.execute({ sql, args });
  return c.json({ data: result.rows });
});

// POST /v1/apps
app.post('/', async (c) => {
  const { org_id, name, domain } = await c.req.json();
  if (!org_id || !name) return c.json({ error: 'org_id and name required' }, 400);
  const id = `app_${nanoid(12)}`;
  await db.execute({
    sql: 'INSERT INTO apps (id, org_id, name, domain) VALUES (?, ?, ?, ?)',
    args: [id, org_id, name, domain || null],
  });
  return c.json({ id, org_id, name }, 201);
});

export default app;
