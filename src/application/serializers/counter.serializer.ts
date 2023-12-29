import { CounterEntity } from 'domain/models';
import { DataParamSerializer } from './data-param.serializer';

export class CounterSerializer {
  key: string;
  initial: DataParamSerializer;
  step: string;
  step_var: DataParamSerializer;

  constructor(initial: CounterEntity) {
    this.key = initial?.key;
    this.initial = new DataParamSerializer(initial?.initial);
    this.step = initial?.step;
    this.step_var = new DataParamSerializer(initial?.stepVar);
  }
}
