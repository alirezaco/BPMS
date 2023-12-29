import { ModelDefinition } from '@nestjs/mongoose';
import { ProcessSchema } from './process.schema';
import { AutoPaySchema } from './autopay.schema';
import { AutoPayActivitySchema } from './autopay-activity.schema';
import { FileSchema } from './file.schema';

export * from './base.schema';
export * from './comparison-step.schema';
export * from './grpc-step.schema';
export * from './api-step.schema';
export * from './data-param.schema';
export * from './process.schema';
export * from './step.schema';
export * from './autopay.schema';
export * from './ui-schema.schema';
export * from './autopay-activity.schema';
export * from './file.schema';
export * from './counter.schema';
export * from './repeat.schema';
export * from './repeat-condition.schema';

export const schemas: ModelDefinition[] = [
  {
    name: ProcessSchema.name,
    schema: ProcessSchema.getSchema(),
    collection: 'processes',
  },
  {
    name: AutoPaySchema.name,
    schema: AutoPaySchema.getScehma(),
    collection: 'autopay',
  },
  {
    name: AutoPayActivitySchema.name,
    schema: AutoPayActivitySchema.getSchema(),
    collection: 'activities',
  },
  {
    name: FileSchema.name,
    schema: FileSchema.getSchema(),
    collection: 'files',
  },
];
