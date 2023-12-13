import { AutoPayActivityRepository } from './autopay-activity.repository';
import { AutoPayRepository } from './autopay.repository';
import { FileRepository } from './file.repository';
import { ProcessRepository } from './process.repository';

export * from './base.repository';
export * from './process.repository';
export * from './autopay.repository';
export * from './autopay-activity.repository';
export * from './file.repository';

export const repositories = [
  ProcessRepository,
  AutoPayRepository,
  AutoPayActivityRepository,
  FileRepository,
];
