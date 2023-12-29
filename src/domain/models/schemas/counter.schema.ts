import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DataParamSchema } from './data-param.schema';

@Schema({
  _id: false,
})
export class CounterSchema {
  @Prop({ type: String, required: true })
  key: string;

  @Prop({ type: DataParamSchema.getSchema(), required: true })
  initial: DataParamSchema;

  @Prop({ type: String, required: true })
  step: string;

  @Prop({ type: DataParamSchema.getSchema(), required: true })
  step_var: DataParamSchema;

  static getSchema() {
    const schema = SchemaFactory.createForClass(this);
    return schema;
  }
}
