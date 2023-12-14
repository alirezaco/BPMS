import { ApiStepMapper } from './api-step.mapper';
import { AutoPayActivityMapper } from './autopay-activity.mapper';
import { AutoPayMapper } from './autopay.mapper';
import { ComparisonStepMapper } from './comparison-step.mapper';
import { DataParamMapper } from './data-param.mapper';
import { FileMapper } from './file.mapper';
import { GrpcStepMapper } from './grpc-step.mapper';
import { ProcessMapper } from './process.mapper';
import { StepMapper } from './step.mapper';
import { UISchemaMapper } from './ui-schema.mapper';

export * from './base.mapper';
export * from './process.mapper';
export * from './step.mapper';
export * from './grpc-step.mapper';
export * from './api-step.mapper';
export * from './comparison-step.mapper';
export * from './data-param.mapper';
export * from './autopay.mapper';
export * from './autopay-activity.mapper';
export * from './file.mapper';
export * from './ui-schema.mapper';

export const mappers = [
  ProcessMapper,
  StepMapper,
  GrpcStepMapper,
  ApiStepMapper,
  ComparisonStepMapper,
  DataParamMapper,
  AutoPayMapper,
  AutoPayActivityMapper,
  FileMapper,
  UISchemaMapper,
];
