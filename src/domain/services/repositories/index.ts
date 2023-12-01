import { AutoPayRepository } from './autopay.repository';
import { ProcessRepository } from './process.repository';

export * from './base.repository';
export * from './process.repository';
export * from './autopay.repository';

export const repositories = [ProcessRepository, AutoPayRepository];
