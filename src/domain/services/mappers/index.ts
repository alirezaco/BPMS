import { ApiStepMapper } from './api-step.mapper';
import { AutoPayMapper } from './autopay.mapper';
import { ComparisonStepMapper } from './comparison-step.mapper';
import { DataParamMapper } from './data-param.mapper';
import { GrpcStepMapper } from './grpc-step.mapper';
import { ProcessMapper } from './process.mapper';
import { StepMapper } from './step.mapper';

export * from './base.mapper';
export * from './process.mapper';
export * from './step.mapper';
export * from './grpc-step.mapper';
export * from './api-step.mapper';
export * from './comparison-step.mapper';
export * from './data-param.mapper';
export * from './autopay.mapper';

export const mappers = [
  ProcessMapper,
  StepMapper,
  GrpcStepMapper,
  ApiStepMapper,
  ComparisonStepMapper,
  DataParamMapper,
  AutoPayMapper,
];
