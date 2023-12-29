import { DataParamEntity } from './data-param.entity';

export class CounterEntity {
  key: string;
  initial: DataParamEntity;
  step: string;
  stepVar: DataParamEntity;
  value: number;

  constructor(initial: Partial<CounterEntity>) {
    this.key = initial?.key;
    this.initial = initial?.initial;
    this.step = initial?.step;
    this.stepVar = initial?.stepVar;
  }
}
