import { ApiStepEntity } from './api-step.entity';
import { AutoPayActivityEntity } from './autopay-activity.entity';
import { AutoPayEntity } from './autopay.entity';
import { ComparisonStepEntity } from './comparison-step.entity';
import { CounterEntity } from './counter.entity';
import { DataParamEntity } from './data-param.entity';
import { FileEntity } from './file.entity';
import { GrpcStepEntity } from './grpc-step.entity';
import { ProcessEntity } from './process.entity';
import { RepeatConditionEntity } from './repeat-condition.entity';
import { RepeatEntity } from './repeat.entity';
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
export * from './autopay-activity.entity';
export * from './file.entity';
export * from './counter.entity';
export * from './repeat.entity';
export * from './repeat-condition.entity';

export const entities = [
  DataParamEntity,
  StepEntity,
  ComparisonStepEntity,
  ApiStepEntity,
  GrpcStepEntity,
  ProcessEntity,
  AutoPayEntity,
  UISchemaEntity,
  AutoPayActivityEntity,
  FileEntity,
  CounterEntity,
  RepeatEntity,
  RepeatConditionEntity,
];
