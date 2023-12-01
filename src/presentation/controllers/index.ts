import { AutopayController } from './autopay.controller';
import { ProcessController } from './process.controller';

export * from './process.controller';
export * from './autopay.controller';

export const controllers = [ProcessController, AutopayController];
