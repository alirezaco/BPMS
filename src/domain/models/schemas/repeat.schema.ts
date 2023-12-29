import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RepeatConditionSchema } from './repeat-condition.schema';
import { CounterSchema } from './counter.schema';

@Schema({
  _id: false,
})
export class RepeatSchema {
  @Prop({ type: RepeatConditionSchema.getSchema(), required: true })
  condition: RepeatConditionSchema;

  @Prop({ type: CounterSchema.getSchema(), required: true })
  counter: CounterSchema;

  @Prop({ type: String, required: true })
  start_step: string;

  @Prop({ type: String, required: true })
  end_step: string;

  static getSchema() {
    const schema = SchemaFactory.createForClass(this);
    return schema;
  }
}
