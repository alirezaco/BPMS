import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';

@Schema({
  id: true,
})
export class FileSchema extends BaseSchema {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  value: string;

  static getSchema() {
    const schema = SchemaFactory.createForClass(this);
    return schema;
  }
}
