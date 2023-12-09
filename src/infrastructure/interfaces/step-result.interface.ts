export interface StepResultInterface {
  success: boolean;
  error?: Record<string, any>;
  isHandledError?: boolean;
  isRetry?: boolean;
}
