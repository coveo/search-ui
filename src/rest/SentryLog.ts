export interface ISentryLog {
  level?: 'WARNING' | 'INFO' | 'DEBUG' | 'FATAL';
  message: string;
  title: string;
}
