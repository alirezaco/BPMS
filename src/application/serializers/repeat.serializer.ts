import { RepeatEntity } from 'domain/models';
import { CounterSerializer } from './counter.serializer';
import { RepeatConditionSerializer } from './repeat-condition.serializer';

export class RepeatSerializer {
  counter: CounterSerializer;
  repeat_condition: RepeatConditionSerializer;
  start_step: string;
  end_step: string;

  constructor(initial: RepeatEntity) {
    this.counter = new CounterSerializer(initial?.counter);
    this.repeat_condition = new RepeatConditionSerializer(initial?.condition);
    this.start_step = initial?.startStep;
    this.end_step = initial?.endStep;
  }
}
