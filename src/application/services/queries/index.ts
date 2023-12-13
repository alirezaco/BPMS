import { AutopayQueueHandler } from './autopay-queue';
import { GetAutopayHandler } from './get-autopay';
import { GetAutopayActivitiesHandler } from './get-autopay-activities';
import { GetAutopaysHandler } from './get-autopays';
import { GetFileHandler } from './get-file';
import { GetProcessHandler } from './get-process';
import { GetProcessesHandler } from './get-processes';
import { GetProcessesAdminHandler } from './get-processes-admin';

export * from './get-process';
export * from './get-processes';
export * from './get-processes-admin';
export * from './get-autopay';
export * from './get-autopays';
export * from './get-autopay-activities';
export * from './autopay-queue';
export * from './get-file';

export const queryHandlers = [
  GetProcessHandler,
  GetProcessesHandler,
  GetProcessesAdminHandler,
  GetAutopayHandler,
  GetAutopaysHandler,
  GetAutopayActivitiesHandler,
  AutopayQueueHandler,
  GetFileHandler,
];
