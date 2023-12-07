import { AutopayActivityController } from './autopay-activity.controller';
import { AutopayController } from './autopay.controller';
import { ProcessController } from './process.controller';

export * from './process.controller';
export * from './autopay.controller';
export * from './autopay-activity.controller';

export const controllers = [
  ProcessController,
  AutopayController,
  AutopayActivityController,
];
