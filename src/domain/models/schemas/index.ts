import { ModelDefinition, SchemaFactory } from '@nestjs/mongoose';
import { ProcessSchema } from './process.schema';

export * from './base.schema';
export * from './comparison-step.schema';
export * from './grpc-step.schema';
export * from './api-step.schema';
export * from './data-param.schema';
export * from './process.schema';
export * from './step.schema';

export const schemas: ModelDefinition[] = [
  {
    name: ProcessSchema.name,
    schema: SchemaFactory.createForClass(ProcessSchema),
    collection: 'processes',
  },
];
