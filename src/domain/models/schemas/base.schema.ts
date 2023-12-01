import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export class BaseSchema {
  _id: Types.ObjectId;

  @Prop({ type: Date, default: () => new Date() })
  created_at: Date;

  @Prop({ type: Date, default: () => new Date() })
  updated_at: Date;

  @Prop({ type: Date, default: null })
  deleted_at: Date;

  @Prop({ type: Date, default: null })
  restored_at: Date;

  @Prop({ type: Types.ObjectId, required: true })
  owner: Types.ObjectId;

  @Prop({ type: [String], required: false, default: [] })
  tags: Array<string>;
}
