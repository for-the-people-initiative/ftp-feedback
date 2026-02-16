# Feedback Module — Architecture Brain

> **Package:** `@for-the-people/feedback-core` + `@for-the-people/feedback-api`
> **Last updated:** 2025-07-20
> **Status:** Planned — Priority 1

---

## Vision

**"Every FTP app ships with built-in user feedback."**

An embeddable widget that collects feedback with automatic context capture (URL, browser, errors), sends it to a backend, runs AI triage (categorize, prioritize, sentiment), and notifies developers of critical issues — all out of the box.

Think: Canny + Sentry's feedback widget + AI, as a reusable FTP module.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                              │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  <ftp-feedback> Widget                                       │   │
│  │  ┌─────────┐  ┌──────────────┐  ┌────────────────────────┐  │   │
│  │  │ Trigger  │→ │ Feedback Form │→ │ Context Collector      │  │   │
│  │  │ (FAB /   │  │ type, title,  │  │ url, userAgent,        │  │   │
│  │  │  inline) │  │ description   │  │ viewport, errors,      │  │   │
│  │  └─────────┘  └──────────────┘  │ screenshot (html2canvas)│  │   │
│  │                                   └────────────┬───────────┘  │   │
│  └────────────────────────────────────────────────┼──────────────┘   │
│                                                    │                  │
└────────────────────────────────────────────────────┼──────────────────┘
                                                     │ POST /api/v1/feedback
                                                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         EDGE API (Hono)                             │
│                                                                     │
│  ┌─────────────┐    ┌──────────────┐    ┌───────────────────────┐  │
│  │ Auth        │ →  │ Validation   │ →  │ FeedbackService       │  │
│  │ Middleware   │    │ (zod)        │    │                       │  │
│  └─────────────┘    └──────────────┘    │ 1. Save to DB (Data)  │  │
│                                          │ 2. Upload screenshot  │  │
│                                          │    (Storage)          │  │
│                                          │ 3. Trigger AI triage  │  │
│                                          │ 4. Send confirmation  │  │
│                                          │    (Mail)             │  │
│                                          └──────────┬────────────┘  │
│                                                      │               │
└──────────────────────────────────────────────────────┼───────────────┘
                                                       │
                                                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       AI TRIAGE PIPELINE                            │
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌───────────────────────┐ │
│  │ Categorize   │ →  │ Prioritize   │ →  │ Route                 │ │
│  │ bug/feature/  │    │ critical →    │    │                       │ │
│  │ question/     │    │ high →        │    │ • critical bug →      │ │
│  │ praise/other  │    │ medium →      │    │   ALERT (Telegram/    │ │
│  │              │    │ low           │    │   Discord/Email)      │ │
│  │ + sentiment  │    │              │    │ • question → auto-    │ │
│  │   analysis   │    │ + AI summary  │    │   answer from FAQ     │ │
│  └──────────────┘    └──────────────┘    │ • feature → backlog   │ │
│                                           │   with AI summary     │ │
│                                           │ • praise → share      │ │
│                                           └───────────────────────┘ │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ Scheduled: Daily/Weekly digest of feedback trends            │   │
│  │ → Email summary to team with stats, top issues, sentiment    │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## TypeScript Interfaces

```typescript
// ─── Enums / Literal Types ────────────────────────────────────────

type FeedbackType = 'bug' | 'feature' | 'question' | 'praise' | 'other'
type FeedbackStatus = 'new' | 'triaged' | 'in-progress' | 'resolved' | 'closed' | 'wont-fix'
type FeedbackPriority = 'critical' | 'high' | 'medium' | 'low'
type FeedbackSentiment = 'positive' | 'neutral' | 'negative'

// ─── Submission (from widget) ─────────────────────────────────────

interface FeedbackSubmission {
  type: FeedbackType
  title: string
  description: string
  sentiment?: FeedbackSentiment
  screenshot?: string              // base64 data URL or uploaded URL
  metadata?: FeedbackMetadata
  userEmail?: string               // if not authenticated
  userName?: string                // if not authenticated
}

interface FeedbackMetadata {
  url: string
  userAgent: string
  screenResolution: string         // e.g. "1920x1080"
  viewport: string                 // e.g. "1440x900"
  language: string                 // navigator.language
  platform: string                 // navigator.platform
  timestamp: string                // ISO 8601
  consoleErrors?: string[]         // last N console.error entries
  customData?: Record<string, unknown>  // app-specific context
}

// ─── Record (stored in DB) ────────────────────────────────────────

interface FeedbackRecord extends FeedbackSubmission {
  id: string
  status: FeedbackStatus
  priority: FeedbackPriority

  // AI-generated fields
  aiSummary?: string               // one-line AI summary
  aiSuggestedPriority?: FeedbackPriority
  aiSuggestedCategory?: string     // e.g. "UI", "Performance", "Data Loss"
  aiAutoResponse?: string          // auto-answer for questions
  aiConfidence?: number            // 0-1, confidence in triage

  // Assignment
  assignedTo?: string              // developer user ID
  resolvedAt?: string              // ISO 8601

  // Auth context (captured server-side)
  userId?: string                  // authenticated user ID
  userEmail?: string
  userName?: string

  // Timestamps
  created_at: string
  updated_at: string
}

// ─── Query & Pagination ───────────────────────────────────────────

interface FeedbackQueryOptions {
  type?: FeedbackType | FeedbackType[]
  status?: FeedbackStatus | FeedbackStatus[]
  priority?: FeedbackPriority | FeedbackPriority[]
  sentiment?: FeedbackSentiment
  search?: string                  // full-text search in title + description
  assignedTo?: string
  userId?: string
  dateFrom?: string                // ISO 8601
  dateTo?: string                  // ISO 8601
  orderBy?: 'created_at' | 'updated_at' | 'priority'
  orderDir?: 'asc' | 'desc'
  page?: number
  limit?: number                   // default 20, max 100
}

interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// ─── Adapter Interface ────────────────────────────────────────────

interface FeedbackAdapter {
  submit(feedback: FeedbackSubmission): Promise<FeedbackRecord>
  list(options?: FeedbackQueryOptions): Promise<PaginatedResult<FeedbackRecord>>
  getById(id: string): Promise<FeedbackRecord | null>
  updateStatus(id: string, status: FeedbackStatus, note?: string): Promise<FeedbackRecord>
  updatePriority(id: string, priority: FeedbackPriority): Promise<FeedbackRecord>
  update(id: string, fields: Partial<FeedbackRecord>): Promise<FeedbackRecord>
  delete(id: string): Promise<void>
  getStats(): Promise<FeedbackStats>
}

// ─── Statistics ───────────────────────────────────────────────────

interface FeedbackStats {
  total: number
  byType: Record<FeedbackType, number>
  byStatus: Record<FeedbackStatus, number>
  byPriority: Record<FeedbackPriority, number>
  bySentiment: Record<FeedbackSentiment, number>
  avgResolutionTimeMs: number
  last30Days: { date: string; count: number }[]
}

// ─── Response (developer replies) ─────────────────────────────────

interface FeedbackResponse {
  id: string
  feedbackId: string
  authorId: string                 // developer who responded
  authorName: string
  message: string
  isPublic: boolean                // visible to the submitter?
  created_at: string
}

// ─── Service Config ───────────────────────────────────────────────

interface FeedbackServiceConfig {
  adapter: FeedbackAdapter
  mail?: MailAdapter                // for notifications
  storage?: StorageAdapter          // for screenshots
  auth?: AuthAdapter                // for user context
  ai?: {
    enabled: boolean
    provider: 'openai' | 'anthropic' | 'custom'
    apiKey: string
    model?: string
    autoTriage: boolean             // auto-categorize + prioritize
    autoRespond: boolean            // auto-answer questions
    alertOnCritical: boolean        // immediate alert for critical bugs
    alertChannels?: ('email' | 'telegram' | 'discord')[]
    alertRecipients?: string[]      // email addresses or channel IDs
  }
  digest?: {
    enabled: boolean
    frequency: 'daily' | 'weekly'
    recipients: string[]
  }
}

// ─── Widget Config ────────────────────────────────────────────────

interface FeedbackWidgetConfig {
  endpoint: string                  // API URL
  apiKey?: string                   // public API key
  mode: 'floating' | 'inline' | 'trigger'
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  theme?: 'light' | 'dark' | 'auto'
  primaryColor?: string
  types?: FeedbackType[]            // which types to show (default: all)
  showScreenshot?: boolean          // enable screenshot capture (default: true)
  showEmail?: boolean               // show email field for anonymous users
  customCategories?: string[]       // additional categories
  placeholder?: string             // description placeholder text
  successMessage?: string
  locale?: string                   // i18n
  customData?: Record<string, unknown>  // injected into metadata
  onSubmit?: (feedback: FeedbackRecord) => void
  onError?: (error: Error) => void
}
```

---

## Widget Component

### Web Component: `<ftp-feedback>`
```html
<!-- Floating button (default) -->
<ftp-feedback
  endpoint="https://myapp.com/api/v1/feedback"
  api-key="pk_live_xxx"
  mode="floating"
  position="bottom-right"
  theme="auto"
></ftp-feedback>

<!-- Inline embedded -->
<ftp-feedback
  endpoint="https://myapp.com/api/v1/feedback"
  mode="inline"
></ftp-feedback>

<!-- Trigger mode (your own button) -->
<button onclick="document.querySelector('ftp-feedback').open()">
  Give Feedback
</button>
<ftp-feedback
  endpoint="https://myapp.com/api/v1/feedback"
  mode="trigger"
></ftp-feedback>
```

### Vue Component Alternative
```vue
<template>
  <FtpFeedback
    endpoint="https://myapp.com/api/v1/feedback"
    mode="floating"
    theme="dark"
    @submit="onFeedbackSubmit"
  />
</template>

<script setup>
import { FtpFeedback } from '@for-the-people/feedback-widget-vue'
</script>
```

### Widget Features
- **Screenshot capture:** html2canvas — captures current viewport, user can annotate (draw/highlight)
- **Auto metadata:** URL, user agent, viewport, screen resolution, language, platform, timestamp
- **Console errors:** Captures last 10 `console.error` entries via monkey-patching
- **Theme:** CSS custom properties for full customization, auto-detects prefers-color-scheme
- **Animations:** Smooth open/close, submit success confetti (optional)
- **Accessibility:** Keyboard navigation, ARIA labels, focus trap in modal
- **Size:** Target < 15KB gzipped (widget + styles)
- **No dependencies:** Vanilla JS web component, zero runtime deps

---

## AI Triage Pipeline

### Flow

```
1. New feedback submitted
         │
         ▼
2. Save to database (status: 'new')
         │
         ▼
3. Upload screenshot to Storage (if present)
         │
         ▼
4. AI Triage (async — webhook or queue)
   ┌─────┴─────────────────────────────────────────┐
   │  Input: title, description, type, metadata     │
   │                                                 │
   │  AI outputs:                                    │
   │  - summary (one-line)                           │
   │  - suggestedPriority: critical/high/medium/low  │
   │  - suggestedCategory: UI, Performance, etc.     │
   │  - sentiment: positive/neutral/negative          │
   │  - autoResponse (for questions)                  │
   │  - confidence: 0-1                              │
   └─────┬───────────────────────────────────────────┘
         │
         ▼
5. Update record with AI fields
         │
         ▼
6. Route based on result:
   │
   ├─ critical + bug ──→ IMMEDIATE ALERT
   │   → Telegram message to developer
   │   → Discord webhook
   │   → Email with full context
   │
   ├─ question ──→ AUTO-RESPOND (if confidence > 0.8)
   │   → Match against FAQ/docs
   │   → Send auto-response to user (email)
   │   → Mark as 'triaged'
   │
   ├─ feature request ──→ BACKLOG
   │   → Add AI summary
   │   → Mark as 'triaged'
   │   → Group with similar requests
   │
   └─ praise ──→ CELEBRATE
       → Forward to team channel
       → Mark as 'closed'
```

### AI Prompt Template
```
You are a feedback triage assistant. Analyze the following user feedback and respond with JSON.

Feedback:
- Type: {type}
- Title: {title}
- Description: {description}
- URL: {metadata.url}
- Console Errors: {metadata.consoleErrors}

Respond with:
{
  "summary": "one-line summary",
  "suggestedPriority": "critical|high|medium|low",
  "suggestedCategory": "UI|Performance|Data|Auth|Payment|Content|Other",
  "sentiment": "positive|neutral|negative",
  "autoResponse": "helpful response if this is a question, null otherwise",
  "confidence": 0.0-1.0,
  "reasoning": "brief explanation of triage decision"
}

Priority guidelines:
- critical: data loss, security issue, app crash, payment failure
- high: major feature broken, blocking user workflow
- medium: minor bug, UX issue, non-blocking
- low: cosmetic, nice-to-have, edge case
```

### Digest Report
```
📊 Weekly Feedback Digest — My Health Journey
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total this week: 23 (+5 from last week)

By type:
  🐛 Bugs: 8
  ✨ Features: 9
  ❓ Questions: 4
  🌟 Praise: 2

By priority:
  🔴 Critical: 1  ← needs attention!
  🟠 High: 3
  🟡 Medium: 12
  🟢 Low: 7

Sentiment: 😊 43% positive · 😐 39% neutral · 😞 18% negative

Top issues:
  1. Chart loading slow on mobile (×3 reports)
  2. Export PDF missing header (×2 reports)
  3. Dark mode contrast on settings page

Resolved: 15 items (avg resolution: 2.3 days)
```

---

## Database Schema (Supabase)

```sql
-- ─── Feedback Table ───────────────────────────────────────────────

CREATE TABLE feedback (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type          TEXT NOT NULL CHECK (type IN ('bug', 'feature', 'question', 'praise', 'other')),
  status        TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'triaged', 'in-progress', 'resolved', 'closed', 'wont-fix')),
  priority      TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  sentiment     TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),

  -- User info
  user_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email    TEXT,
  user_name     TEXT,

  -- Screenshot
  screenshot_url TEXT,

  -- Metadata (JSON)
  metadata      JSONB DEFAULT '{}',

  -- AI triage fields
  ai_summary            TEXT,
  ai_suggested_priority TEXT CHECK (ai_suggested_priority IN ('critical', 'high', 'medium', 'low')),
  ai_suggested_category TEXT,
  ai_auto_response      TEXT,
  ai_confidence         REAL,
  ai_triaged_at         TIMESTAMPTZ,

  -- Assignment
  assigned_to   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at   TIMESTAMPTZ,

  -- Timestamps
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_feedback_status ON feedback(status);
CREATE INDEX idx_feedback_type ON feedback(type);
CREATE INDEX idx_feedback_priority ON feedback(priority);
CREATE INDEX idx_feedback_user_id ON feedback(user_id);
CREATE INDEX idx_feedback_created_at ON feedback(created_at DESC);
CREATE INDEX idx_feedback_search ON feedback USING GIN (to_tsvector('english', title || ' ' || description));

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER feedback_updated_at
  BEFORE UPDATE ON feedback
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Responses Table ──────────────────────────────────────────────

CREATE TABLE feedback_responses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id   UUID NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,
  author_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name   TEXT NOT NULL,
  message       TEXT NOT NULL,
  is_public     BOOLEAN NOT NULL DEFAULT true,     -- visible to submitter?
  is_ai         BOOLEAN NOT NULL DEFAULT false,    -- AI-generated response?
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_feedback_responses_feedback_id ON feedback_responses(feedback_id);

-- ─── Tags Table ───────────────────────────────────────────────────

CREATE TABLE feedback_tags (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id   UUID NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,
  tag           TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(feedback_id, tag)
);

CREATE INDEX idx_feedback_tags_tag ON feedback_tags(tag);
CREATE INDEX idx_feedback_tags_feedback_id ON feedback_tags(feedback_id);

-- ─── RLS Policies ─────────────────────────────────────────────────

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_tags ENABLE ROW LEVEL SECURITY;

-- Anyone can submit feedback
CREATE POLICY "Anyone can insert feedback"
  ON feedback FOR INSERT
  WITH CHECK (true);

-- Users can see their own feedback
CREATE POLICY "Users can view own feedback"
  ON feedback FOR SELECT
  USING (user_id = auth.uid() OR user_email = auth.email());

-- Admins can see all feedback (via custom claim or role)
CREATE POLICY "Admins can view all feedback"
  ON feedback FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- Admins can update feedback
CREATE POLICY "Admins can update feedback"
  ON feedback FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');

-- Public responses visible to feedback owner
CREATE POLICY "Users can view public responses on own feedback"
  ON feedback_responses FOR SELECT
  USING (
    is_public = true
    AND feedback_id IN (
      SELECT id FROM feedback WHERE user_id = auth.uid()
    )
  );

-- Admins can manage responses
CREATE POLICY "Admins can manage responses"
  ON feedback_responses FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
```

---

## API Endpoints

### Base: `/api/v1/feedback`

| Method | Path                          | Auth       | Description                     |
|--------|-------------------------------|------------|---------------------------------|
| POST   | `/api/v1/feedback`            | Optional*  | Submit new feedback             |
| GET    | `/api/v1/feedback`            | Admin      | List feedback (with filters)    |
| GET    | `/api/v1/feedback/:id`        | Admin/Owner| Get single feedback             |
| PUT    | `/api/v1/feedback/:id/status` | Admin      | Update status                   |
| PUT    | `/api/v1/feedback/:id/priority`| Admin     | Update priority                 |
| PUT    | `/api/v1/feedback/:id`        | Admin      | Update any fields               |
| DELETE | `/api/v1/feedback/:id`        | Admin      | Delete feedback                 |
| GET    | `/api/v1/feedback/stats`      | Admin      | Get statistics                  |
| POST   | `/api/v1/feedback/:id/respond`| Admin      | Add developer response          |
| GET    | `/api/v1/feedback/:id/responses` | Admin/Owner | List responses              |
| POST   | `/api/v1/feedback/webhook`    | Internal   | AI triage webhook callback      |

*\*Optional auth: if user is authenticated, captures user context. Anonymous submissions allowed with email.*

### Example Requests

```bash
# Submit feedback (from widget)
POST /api/v1/feedback
Content-Type: application/json
{
  "type": "bug",
  "title": "Chart not loading",
  "description": "Weekly overview chart shows blank white screen on mobile",
  "metadata": {
    "url": "https://myapp.com/dashboard",
    "userAgent": "Mozilla/5.0 ...",
    "viewport": "375x812",
    "screenResolution": "1125x2436",
    "language": "nl-NL",
    "platform": "iPhone",
    "timestamp": "2025-07-20T14:30:00Z",
    "consoleErrors": ["TypeError: Cannot read property 'map' of undefined"]
  }
}

# List with filters (admin)
GET /api/v1/feedback?status=new&priority=critical,high&limit=20&page=1
Authorization: Bearer <admin_token>

# Update status
PUT /api/v1/feedback/abc-123/status
Authorization: Bearer <admin_token>
{
  "status": "in-progress",
  "note": "Assigned to frontend team"
}

# Developer response
POST /api/v1/feedback/abc-123/respond
Authorization: Bearer <admin_token>
{
  "message": "Thanks for reporting! We've fixed this in v2.3.1.",
  "isPublic": true
}
```

### Hono Implementation Sketch
```typescript
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import type { FeedbackServiceConfig } from '@for-the-people/feedback-core'

export function createFeedbackApi(config: FeedbackServiceConfig) {
  const app = new Hono()
  const service = createFeedbackService(config)

  app.post('/',
    zValidator('json', feedbackSubmissionSchema),
    async (c) => {
      const body = c.req.valid('json')
      const user = c.get('user') // optional auth middleware
      const record = await service.submit({ ...body, userId: user?.id })
      return c.json(record, 201)
    }
  )

  app.get('/', adminGuard, async (c) => {
    const query = c.req.query()
    const result = await service.list(query)
    return c.json(result)
  })

  app.get('/stats', adminGuard, async (c) => {
    const stats = await service.getStats()
    return c.json(stats)
  })

  // ... more routes

  return app
}
```

---

## Integration with Other Modules

```typescript
import { createFeedbackService } from '@for-the-people/feedback-core'
import { createSupabaseAdapter } from '@for-the-people/data-core'
import { createResendAdapter } from '@for-the-people/mail-core'
import { createSupabaseAuth } from '@for-the-people/auth-core'
import { createSupabaseStorage } from '@for-the-people/storage-core'

const feedbackService = createFeedbackService({
  // Required: data storage
  adapter: createSupabaseFeedbackAdapter(supabase),

  // Optional: email notifications
  mail: createResendAdapter(process.env.RESEND_API_KEY!),

  // Optional: user context enrichment
  auth: createSupabaseAuth(supabase),

  // Optional: screenshot storage
  storage: createSupabaseStorage(supabase),

  // Optional: AI triage
  ai: {
    enabled: true,
    provider: 'anthropic',
    apiKey: process.env.ANTHROPIC_API_KEY!,
    model: 'claude-sonnet-4-20250514',
    autoTriage: true,
    autoRespond: true,
    alertOnCritical: true,
    alertChannels: ['telegram', 'email'],
    alertRecipients: ['dev@example.com'],
  },

  // Optional: digest reports
  digest: {
    enabled: true,
    frequency: 'weekly',
    recipients: ['team@example.com'],
  },
})
```

### Module Dependency Map
```
feedback-core
  ├── data-core       (required — stores feedback records)
  ├── mail-core       (optional — email notifications, digests)
  ├── auth-core       (optional — user context, admin guards)
  ├── storage-core    (optional — screenshot uploads)
  └── [AI provider]   (optional — triage, auto-response)
```

---

## Deployment

### Widget Distribution
```
@for-the-people/feedback-widget        → Vanilla JS web component (CDN)
@for-the-people/feedback-widget-vue    → Vue 3 component wrapper
@for-the-people/feedback-widget-react  → React component wrapper
```

**CDN delivery:**
```html
<script src="https://cdn.jsdelivr.net/npm/@for-the-people/feedback-widget@latest/dist/widget.min.js"></script>
<ftp-feedback endpoint="https://api.myapp.com/api/v1/feedback" />
```

### API Deployment
- **Runtime:** Hono on Cloudflare Workers / Vercel Edge / Deno Deploy
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage (screenshots)
- **AI Triage:** Triggered via:
  - Webhook (immediate, on submit)
  - Queue/cron (batch, every 5 min)
  - Supabase Edge Function (database trigger)

### Environment Variables
```env
# Required
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...

# Optional - Mail
RESEND_API_KEY=re_xxx

# Optional - AI
ANTHROPIC_API_KEY=sk-ant-xxx
AI_TRIAGE_ENABLED=true

# Optional - Alerts
TELEGRAM_BOT_TOKEN=xxx
TELEGRAM_CHAT_ID=xxx
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxx
```

---

## Package Structure

```
packages/
├── feedback-core/
│   ├── src/
│   │   ├── types/index.ts
│   │   ├── adapters/
│   │   │   ├── adapter.ts              # FeedbackAdapter interface
│   │   │   └── supabase.adapter.ts     # Supabase implementation
│   │   ├── services/
│   │   │   ├── feedback.service.ts     # Main orchestration
│   │   │   └── triage.service.ts       # AI triage logic
│   │   ├── errors/index.ts
│   │   └── index.ts
│   ├── tsup.config.ts
│   └── package.json
│
├── feedback-api/
│   ├── src/
│   │   ├── routes/feedback.routes.ts
│   │   ├── middleware/auth.ts
│   │   ├── validation/schemas.ts       # Zod schemas
│   │   └── index.ts
│   ├── tsup.config.ts
│   └── package.json
│
└── feedback-widget/
    ├── src/
    │   ├── widget.ts                   # Web component
    │   ├── form.ts                     # Form UI
    │   ├── screenshot.ts               # html2canvas wrapper
    │   ├── metadata.ts                 # Context collector
    │   ├── styles.ts                   # CSS-in-JS (shadow DOM)
    │   └── index.ts
    ├── tsup.config.ts
    └── package.json
```

---

## Implementation Checklist

- [ ] Define types & interfaces (`feedback-core/src/types/`)
- [ ] Build adapter interface (`feedback-core/src/adapters/adapter.ts`)
- [ ] Build Supabase adapter (`feedback-core/src/adapters/supabase.adapter.ts`)
- [ ] Build feedback service (`feedback-core/src/services/feedback.service.ts`)
- [ ] Build AI triage service (`feedback-core/src/services/triage.service.ts`)
- [ ] Create Supabase migration (tables, indexes, RLS)
- [ ] Build API routes (`feedback-api/`)
- [ ] Build widget web component (`feedback-widget/`)
- [ ] Screenshot capture integration
- [ ] Metadata auto-collection
- [ ] AI triage pipeline (Anthropic integration)
- [ ] Critical alert routing (Telegram/Discord/Email)
- [ ] Digest report generation
- [ ] Vue wrapper component
- [ ] Tests (adapter, service, API)
- [ ] Publish to npm
- [ ] CDN setup for widget
- [ ] Documentation & README
