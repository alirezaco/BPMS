import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';
import mongoose, { Types } from 'mongoose';
import { ActivityStatusEnum } from 'infrastructure/enum';
import { ResultStep, RunningStepType } from 'infrastructure/types';
import { AutoPaySchema } from './autopay.schema';

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

  @Prop({ type: [[String, Number]], required: false, default: [] })
  successful_steps: RunningStepType[];

  @Prop({ type: [[String, Number]], required: false, default: [] })
  failed_steps: RunningStepType[];

  @Prop({ type: Boolean, required: false, default: false })
  has_payment: boolean;

  @Prop({ type: Number, required: false, default: 0 })
  payment_amount: number;

  @Prop({ type: [String, Number], required: false, default: [] })
  RunningStep?: RunningStepType;

  @Prop({ type: mongoose.Schema.Types.Mixed, required: false, default: [] })
  responsesSteps?: ResultStep[];

  static getSchema() {
    const schema = SchemaFactory.createForClass(this);
    schema.virtual('autopay', {
      ref: AutoPaySchema.name,
      localField: 'autopay_id',
      foreignField: '_id',
      justOne: true,
    });
    schema.virtual('process', {
      ref: AutoPaySchema.name,
      localField: 'process_id',
      foreignField: '_id',
      justOne: true,
    });
    return schema;
  }
}
