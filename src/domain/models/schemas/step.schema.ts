import { ProcessStepTypeEnum } from 'infrastructure/enum';
import { ApiStepSchema } from './api-step.schema';
import { ComparisonStepSchema } from './comparison-step.schema';
import { GrpcStepSchema } from './grpc-step.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: true })
export class StepSchema {
  _id: Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, enum: ProcessStepTypeEnum, required: true })
  type: ProcessStepTypeEnum;

  @Prop({
    type: SchemaFactory.createForClass(ComparisonStepSchema),
    required: false,
  })
  comparison?: ComparisonStepSchema;

  @Prop({
    type: SchemaFactory.createForClass(GrpcStepSchema),
    required: false,
  })
  grpc?: GrpcStepSchema;

  @Prop({
    type: SchemaFactory.createForClass(ApiStepSchema),
    required: false,
  })
  api?: ApiStepSchema;

  @Prop({
    type: Boolean,
    default: false,
  })
  is_sync: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  is_final: boolean;

  @Prop({
    type: String,
    required: false,
  })
  fail_step?: string;
}
