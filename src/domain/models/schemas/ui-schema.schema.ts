import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class UISchemaSchema {
  @Prop({ type: String, required: true })
  key: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: String, required: false })
  hint?: string;

  @Prop({ type: Number, required: false })
  min?: number;

  @Prop({ type: Number, required: false })
  max?: number;

  @Prop({ type: String, required: false })
  regex?: string;

  @Prop({ type: String, required: false })
  error_text?: string;

  @Prop({ type: Boolean, required: false })
  is_required?: boolean;

  @Prop({ type: Boolean, required: false })
  is_money?: boolean;

  @Prop({ type: Boolean, required: false })
  is_english?: boolean;

  @Prop({ type: Number, required: false })
  weight?: number;

  @Prop({ type: String, required: false })
  true_text?: string;

  @Prop({ type: String, required: false })
  false_text?: string;
}
