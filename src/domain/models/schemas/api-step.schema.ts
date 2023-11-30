import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DataParamSchema } from './data-param.schema';

@Schema({ _id: false })
export class ApiStepSchema {
  @Prop({ type: String, required: true })
  method: string;

  @Prop({ type: String, required: true })
  url: string;

  @Prop({
    type: [SchemaFactory.createForClass(DataParamSchema)],
    required: false,
    default: [],
    _id: false,
  })
  headers: DataParamSchema[];

  @Prop({
    type: [SchemaFactory.createForClass(DataParamSchema)],
    required: false,
    default: [],
    _id: false,
  })
  params: DataParamSchema[];

  @Prop({
    type: [SchemaFactory.createForClass(DataParamSchema)],
    required: false,
    default: [],
    _id: false,
  })
  body: DataParamSchema[];

  @Prop({
    type: [SchemaFactory.createForClass(DataParamSchema)],
    required: false,
    default: [],
    _id: false,
  })
  query: DataParamSchema[];
}
