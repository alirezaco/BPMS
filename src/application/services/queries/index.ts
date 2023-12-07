import { GetAutopayHandler } from './get-autopay';
import { GetAutopaysHandler } from './get-autopays';
import { GetProcessHandler } from './get-process';
import { GetProcessesHandler } from './get-processes';
import { GetProcessesAdminHandler } from './get-processes-admin';

export * from './get-process';
export * from './get-processes';
export * from './get-processes-admin';
export * from './get-autopay';
export * from './get-autopays';

export const queryHandlers = [
  GetProcessHandler,
  GetProcessesHandler,
  GetProcessesAdminHandler,
  GetAutopayHandler,
  GetAutopaysHandler,
];
