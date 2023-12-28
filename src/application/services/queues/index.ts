import { FailedQueue } from './failed.queue';
import { InitialJobsQueue } from './initial-jobs.queue';
import { ProcessQueue } from './process.queue';

export * from './process.queue';
export * from './failed.queue';
export * from './initial-jobs.queue';

export const queues = [ProcessQueue, FailedQueue, InitialJobsQueue];
