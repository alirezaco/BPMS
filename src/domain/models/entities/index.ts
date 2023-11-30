import { ApiStepEntity } from './api-step.entity';
import { ComparisonStepEntity } from './comparison-step.entity';
import { DataParamEntity } from './data-param.entity';
import { GrpcStepEntity } from './grpc-step.entity';
import { ProcessEntity } from './process.entity';
import { StepEntity } from './step.entity';

export * from './base.entity';
export * from './data-param.entity';
export * from './process.entity';
export * from './step.entity';
export * from './comparison-step.entity';
export * from './api-step.entity';
export * from './grpc-step.entity';

export const entities = [
  DataParamEntity,
  StepEntity,
  ComparisonStepEntity,
  ApiStepEntity,
  GrpcStepEntity,
  ProcessEntity,
];
