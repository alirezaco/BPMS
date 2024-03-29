import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';
import mongoose from 'mongoose';
import { StepSchema } from './step.schema';
import { PeriodEnum } from 'infrastructure/enum';
import { UISchemaSchema } from './ui-schema.schema';
import { RepeatSchema } from './repeat.schema';

@Schema({
  id: true,
})
export class ProcessSchema extends BaseSchema {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, required: true })
  service_name: string;

  @Prop({ type: [String], required: true })
  roles: string[];

  @Prop({ type: String, required: false })
  default_fail_step?: string;

  @Prop({ type: Boolean, required: false })
  allowed_direct_debit?: boolean;

  @Prop({ type: Number, required: false })
  max_amount?: number;

  @Prop({ type: Number, required: false })
  min_amount?: number;

  @Prop({ type: String, enum: PeriodEnum, required: false })
  period?: PeriodEnum;

  @Prop({ type: String, required: false })
  cron?: string;

  @Prop({ type: mongoose.Schema.Types.Mixed, required: false })
  validation_data?: Record<string, any>;

  @Prop({
    type: [SchemaFactory.createForClass(UISchemaSchema)],
    required: false,
  })
  ui_schema?: UISchemaSchema[];

  @Prop({
    type: [SchemaFactory.createForClass(StepSchema)],
    required: true,
    minlength: 1,
    _id: true,
  })
  steps: StepSchema[];

  @Prop({ type: mongoose.Schema.Types.Mixed, required: true, default: {} })
  data: Record<string, any>;

  @Prop({ type: Boolean, default: false })
  is_active: boolean;

  @Prop({ type: Boolean, default: false })
  is_repeatable: boolean;

  @Prop({ type: RepeatSchema.getSchema(), required: false })
  repeat?: RepeatSchema;

  static getSchema() {
    const schema = SchemaFactory.createForClass(this);
    return schema;
  }
}
