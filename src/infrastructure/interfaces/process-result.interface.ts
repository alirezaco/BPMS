export interface ProcessResultInterface {
  success: boolean;
  error?: Record<string, any>;
  isHandledError?: boolean;
  isRetry?: boolean;
}
