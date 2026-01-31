import { Hono } from 'hono';
import { db } from '../db/client.js';
import { nanoid } from 'nanoid';
import { rateLimit } from '../middleware/rate-limit.js';

const app = new Hono();

// POST /v1/feedback - Widget submits here
app.post('/', rateLimit({ max: 10, windowMs: 60_000 }), async (c) => {
  const appId = c.req.header('x-app-id') || c.req.query('app_id');

  if (!appId) {
    return c.json({ error: 'Missing app_id' }, 400);
  }

  // Validate app exists
  const appResult = await db.execute({
    sql: 'SELECT id FROM apps WHERE id = ?',
    args: [appId],
  });
  if (appResult.rows.length === 0) {
    return c.json({ error: 'Invalid app_id' }, 404);
  }

  const body = await c.req.json();
  const { type, title, body: feedbackBody, user_id, user_email, page_url, route, user_agent, viewport, console_errors, app_version, screenshots } = body;

  if (!type || !title) {
    return c.json({ error: 'type and title are required' }, 400);
  }

  if (!['bug', 'suggestion', 'question'].includes(type)) {
    return c.json({ error: 'type must be bug, suggestion, or question' }, 400);
  }

  const id = `fb_${nanoid(16)}`;
  const screenshotsJson = screenshots?.length ? JSON.stringify(screenshots) : null;

  await db.execute({
    sql: `INSERT INTO feedback (id, app_id, type, title, body, user_id, user_email, page_url, route, user_agent, viewport, console_errors, app_version, screenshots_json)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [id, appId, type, title, feedbackBody || null, user_id || null, user_email || null, page_url || null, route || null, user_agent || null, viewport || null, console_errors || null, app_version || null, screenshotsJson],
  });

  return c.json({ id, status: 'created' }, 201);
});

// GET /v1/feedback - List feedback (dashboard)
app.get('/', async (c) => {
  const appId = c.req.query('app_id');
  const status = c.req.query('status');
  const limit = Math.min(parseInt(c.req.query('limit') || '50'), 100);
  const offset = parseInt(c.req.query('offset') || '0');

  let sql = 'SELECT * FROM feedback WHERE 1=1';
  const args: any[] = [];

  if (appId) {
    sql += ' AND app_id = ?';
    args.push(appId);
  }
  if (status) {
    sql += ' AND status = ?';
    args.push(status);
  }

  sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  args.push(limit, offset);

  const result = await db.execute({ sql, args });

  // Get total count
  let countSql = 'SELECT COUNT(*) as total FROM feedback WHERE 1=1';
  const countArgs: any[] = [];
  if (appId) { countSql += ' AND app_id = ?'; countArgs.push(appId); }
  if (status) { countSql += ' AND status = ?'; countArgs.push(status); }
  const countResult = await db.execute({ sql: countSql, args: countArgs });

  return c.json({
    data: result.rows,
    total: countResult.rows[0].total,
    limit,
    offset,
  });
});

// GET /v1/feedback/:id
app.get('/:id', async (c) => {
  const result = await db.execute({
    sql: 'SELECT * FROM feedback WHERE id = ?',
    args: [c.req.param('id')],
  });
  if (result.rows.length === 0) return c.json({ error: 'Not found' }, 404);
  return c.json(result.rows[0]);
});

// PATCH /v1/feedback/:id
app.patch('/:id', async (c) => {
  const body = await c.req.json();
  const { status } = body;

  if (status && !['new', 'seen', 'in_progress', 'resolved', 'wont_fix'].includes(status)) {
    return c.json({ error: 'Invalid status' }, 400);
  }

  const sets: string[] = [];
  const args: any[] = [];

  if (status) { sets.push('status = ?'); args.push(status); }
  sets.push("updated_at = datetime('now')");
  args.push(c.req.param('id'));

  await db.execute({
    sql: `UPDATE feedback SET ${sets.join(', ')} WHERE id = ?`,
    args,
  });

  return c.json({ updated: true });
});

export default app;
