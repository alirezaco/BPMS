import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class DataParamSchema {
  @Prop({ required: true, type: String })
  source: string;

  @Prop({ required: true, type: String })
  key: string;

  @Prop({ required: true, type: String })
  source_key: string;
}
