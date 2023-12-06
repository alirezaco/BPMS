import { ApiStepEntity } from './api-step.entity';
import { AutoPayEntity } from './autopay.entity';
import { ComparisonStepEntity } from './comparison-step.entity';
import { DataParamEntity } from './data-param.entity';
import { GrpcStepEntity } from './grpc-step.entity';
import { ProcessEntity } from './process.entity';
import { StepEntity } from './step.entity';
import { UISchemaEntity } from './ui-schema.entity';

export * from './base.entity';
export * from './data-param.entity';
export * from './process.entity';
export * from './step.entity';
export * from './comparison-step.entity';
export * from './api-step.entity';
export * from './grpc-step.entity';
export * from './autopay.entity';
export * from './ui-schema.entity';

export const entities = [
  DataParamEntity,
  StepEntity,
  ComparisonStepEntity,
  ApiStepEntity,
  GrpcStepEntity,
  ProcessEntity,
  AutoPayEntity,
  UISchemaEntity,
];
