import { Prop, Schema } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';
import { Types } from 'mongoose';
import { ActivityStatusEnum } from 'infrastructure/enum';
import { ResultStep, RunningStepType } from 'infrastructure/types';

@Schema({ id: true })
export class AutoPayActivitySchema extends BaseSchema {
  @Prop({ type: Types.ObjectId, required: true })
  autopay_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  process_id: Types.ObjectId;

  @Prop({ type: String, required: true, enum: ActivityStatusEnum })
  status: ActivityStatusEnum;

  @Prop({ type: Number, required: true })
  running_time: number;

  @Prop({ type: [[Number, String]], required: false, default: [] })
  successful_steps: RunningStepType[];

  @Prop({ type: [[Number, String]], required: false, default: [] })
  failed_steps: RunningStepType[];

  @Prop({ type: Boolean, required: false, default: false })
  has_payment: boolean;

  @Prop({ type: Number, required: false, default: 0 })
  payment_amount: number;

  @Prop({ type: [Number, String], required: false, default: [] })
  RunningStep?: RunningStepType;

  @Prop({ type: [[Number, Object]], required: false, default: [] })
  responsesSteps?: ResultStep[];
}
