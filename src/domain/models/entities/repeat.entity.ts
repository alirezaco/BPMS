import { CounterEntity } from './counter.entity';
import { RepeatConditionEntity } from './repeat-condition.entity';

export class RepeatEntity {
  condition: RepeatConditionEntity;
  counter: CounterEntity;
  startStep: string;
  endStep: string;

  constructor(initial: Partial<RepeatEntity>) {
    this.condition = initial?.condition;
    this.counter = initial?.counter;
    this.startStep = initial?.startStep;
    this.endStep = initial?.endStep;
  }
}
