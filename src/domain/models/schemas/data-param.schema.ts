import { Prop, Schema } from '@nestjs/mongoose';
import { SourceEnum } from 'infrastructure/enum/source.enum';

@Schema({ _id: false })
export class DataParamSchema {
  @Prop({ required: true, type: String, enum: SourceEnum })
  source: SourceEnum;

  @Prop({ required: true, type: String })
  key: string;

  @Prop({ required: true, type: String })
  source_key: string;
}
