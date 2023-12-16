import { Prop, Schema } from '@nestjs/mongoose';
import { DataParamSchema } from './data-param.schema';
import { ComparisonFunctionEnum } from 'infrastructure/enum';
import { Types } from 'mongoose';

@Schema({ _id: false })
export class ComparisonStepSchema {
  @Prop({ required: true, type: String, enum: ComparisonFunctionEnum })
  func: ComparisonFunctionEnum;

  @Prop({ type: DataParamSchema, required: false })
  left?: DataParamSchema;

  @Prop({ type: DataParamSchema, required: false })
  right?: DataParamSchema;

  @Prop({
    type: [Types.Map],
    required: false,
    _id: false,
    default: [],
  })
  children: ComparisonStepSchema[];
}
