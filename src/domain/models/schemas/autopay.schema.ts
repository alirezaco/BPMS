import { Prop, Schema } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';
import { PeriodEnum, ProcessingStatusEnum } from 'infrastructure/enum';
import mongoose, { Types } from 'mongoose';
import { ProcessSchema } from './process.schema';

@Schema({
  id: true,
})
export class AutoPaySchema extends BaseSchema {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Types.ObjectId, required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: ProcessSchema.name })
  process_id: Types.ObjectId;

  @Prop({ type: Number, required: true })
  max_amount: number;

  @Prop({ type: Boolean, default: false })
  allowed_direct_debit: boolean;

  @Prop({ type: String, required: true, enum: PeriodEnum })
  period: PeriodEnum;

  @Prop({ type: String, required: false })
  cron?: string;

  @Prop({ type: Boolean, default: true })
  is_active: boolean;

  @Prop({ type: Date })
  last_run_at: Date;

  @Prop({
    type: String,
    enum: ProcessingStatusEnum,
    default: ProcessingStatusEnum.PENDING,
  })
  processing_status: ProcessingStatusEnum;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  data: Record<string, any>;
}
