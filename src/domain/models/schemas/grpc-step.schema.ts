import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DataParamSchema } from './data-param.schema';
import { Types } from 'mongoose';
import { FileSchema } from './file.schema';

@Schema({ _id: false })
export class GrpcStepSchema {
  @Prop({ required: true, type: String })
  service: string;

  @Prop({ required: true, type: String })
  package: string;

  @Prop({ required: true, type: String })
  method: string;

  @Prop({ required: true, type: Types.ObjectId, ref: FileSchema.name })
  protofile: Types.ObjectId;

  @Prop({ required: true, type: String })
  url: string;

  @Prop({
    type: [SchemaFactory.createForClass(DataParamSchema)],
    required: false,
    default: [],
    _id: false,
  })
  metadata: DataParamSchema[];

  @Prop({
    type: [SchemaFactory.createForClass(DataParamSchema)],
    required: false,
    default: [],
    _id: false,
  })
  payload: DataParamSchema[];
}
