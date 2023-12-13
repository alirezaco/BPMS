import { FailedQueue } from './failed.queue';
import { ProcessQueue } from './process.queue';

export * from './process.queue';
export * from './failed.queue';

export const queues = [ProcessQueue, FailedQueue];
