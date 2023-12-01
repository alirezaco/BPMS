import { GetProcessHandler } from './get-process';
import { GetProcessesHandler } from './get-processes';
import { GetProcessesAdminHandler } from './get-processes-admin';

export * from './get-process';
export * from './get-processes';
export * from './get-processes-admin';

export const queryHandlers = [
  GetProcessHandler,
  GetProcessesHandler,
  GetProcessesAdminHandler,
];
