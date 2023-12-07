import { AutoPayActivityFactory } from './autopay-activity.factory';
import { AutoPayFactory } from './autopay.factory';
import { ProcessFactory } from './process.factory';

export * from './base.factory';
export * from './process.factory';
export * from './autopay.factory';
export * from './autopay-activity.factory';

export const factories = [
  ProcessFactory,
  AutoPayFactory,
  AutoPayActivityFactory,
];
