import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ComparisonFunctionEnum } from 'infrastructure/enum';
import { DataParamSchema } from './data-param.schema';

@Schema({ _id: false })
export class RepeatConditionSchema {
  @Prop({ type: String, enum: ComparisonFunctionEnum, required: true })
  func: ComparisonFunctionEnum;

  @Prop({ type: DataParamSchema, required: true })
  variable: DataParamSchema;

  static getSchema() {
    const schema = SchemaFactory.createForClass(this);
    return schema;
  }
}
