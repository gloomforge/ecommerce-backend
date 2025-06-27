import 'express-session';

declare module 'express-session' {
  interface SessionData {
    sessionId?: number;
    userId?: number;
  }
}
