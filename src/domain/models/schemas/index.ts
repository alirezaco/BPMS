import { ModelDefinition, SchemaFactory } from '@nestjs/mongoose';
import { ProcessSchema } from './process.schema';
import { AutoPaySchema } from './autopay.schema';

export * from './base.schema';
export * from './comparison-step.schema';
export * from './grpc-step.schema';
export * from './api-step.schema';
export * from './data-param.schema';
export * from './process.schema';
export * from './step.schema';
export * from './autopay.schema';
export * from './ui-schema.schema';

export const schemas: ModelDefinition[] = [
  {
    name: ProcessSchema.name,
    schema: SchemaFactory.createForClass(ProcessSchema),
    collection: 'processes',
  },
  {
    name: AutoPaySchema.name,
    schema: SchemaFactory.createForClass(AutoPaySchema),
    collection: 'autopay',
  },
];
