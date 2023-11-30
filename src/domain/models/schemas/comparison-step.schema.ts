import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DataParamSchema } from './data-param.schema';
import { ComparisonFunctionEnum } from 'infrastructure/enum';

@Schema({ _id: false })
export class ComparisonStepSchema {
  @Prop({ required: true, type: String, enum: ComparisonFunctionEnum })
  func: ComparisonFunctionEnum;

  @Prop({ type: DataParamSchema, required: false, default: {} })
  left?: DataParamSchema;

  @Prop({ type: DataParamSchema, required: false, default: {} })
  right?: DataParamSchema;

  @Prop({
    type: [SchemaFactory.createForClass(ComparisonStepSchema)],
    required: false,
    _id: false,
    default: [],
  })
  children: ComparisonStepSchema[];
}
