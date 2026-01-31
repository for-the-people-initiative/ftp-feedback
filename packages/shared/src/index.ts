export interface Organization {
  id: string;
  name: string;
  email: string;
  plan: string;
  created_at: string;
}

export interface App {
  id: string;
  org_id: string;
  name: string;
  domain: string | null;
  settings: string | null;
  created_at: string;
}

export interface ApiKey {
  id: string;
  org_id: string;
  app_id: string | null;
  key_hash: string;
  prefix: string;
  created_at: string;
  last_used: string | null;
}

export interface Feedback {
  id: string;
  app_id: string;
  type: 'bug' | 'suggestion' | 'question';
  title: string;
  body: string | null;
  status: 'new' | 'seen' | 'in_progress' | 'resolved' | 'wont_fix';
  user_id: string | null;
  user_email: string | null;
  page_url: string | null;
  route: string | null;
  user_agent: string | null;
  viewport: string | null;
  console_errors: string | null;
  app_version: string | null;
  screenshots_json: string | null;
  created_at: string;
  updated_at: string;
}

export interface FeedbackSubmission {
  type: 'bug' | 'suggestion' | 'question';
  title: string;
  body?: string;
  user_id?: string;
  user_email?: string;
  page_url?: string;
  route?: string;
  user_agent?: string;
  viewport?: string;
  console_errors?: string;
  app_version?: string;
  screenshots?: string[]; // base64 strings
}

export interface WidgetConfig {
  appId: string;
  apiUrl?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: 'light' | 'dark' | 'auto';
  categories?: string[];
  user?: {
    id?: string;
    email?: string;
  };
  onSubmit?: (feedback: FeedbackSubmission) => void;
  onError?: (error: Error) => void;
}
