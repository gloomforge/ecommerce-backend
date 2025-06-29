import 'express-session';

declare module 'express-session' {
  interface SessionData {
    /**
     * Свойство объекта сессии, которое будет доступна в сессии
     */
    userId?: string;
  }
}
