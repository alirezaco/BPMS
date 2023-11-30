import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';
import mongoose from 'mongoose';
import { StepSchema } from './step.schema';
import { PeriodEnum } from 'infrastructure/enum';

@Schema({
  id: true,
})
export class ProcessSchema extends BaseSchema {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: [String], required: true })
  roles: string[];

  @Prop({ type: String, required: false })
  default_fail_step?: string;

  @Prop({ type: Boolean, required: false })
  allowed_direct_debit?: boolean;

  @Prop({ type: Number, required: false })
  max_amount?: number;

  @Prop({ type: String, enum: PeriodEnum, required: false })
  period?: PeriodEnum;

  @Prop({ type: String, required: false })
  cron?: string;

  @Prop({ type: mongoose.Schema.Types.Mixed, required: false })
  validation_data?: Record<string, any>;

  @Prop({
    type: [SchemaFactory.createForClass(StepSchema)],
    required: true,
    minlength: 1,
    _id: true,
  })
  steps: StepSchema[];

  @Prop({ type: mongoose.Schema.Types.Mixed, required: true, default: {} })
  data: Record<string, any>;
}
