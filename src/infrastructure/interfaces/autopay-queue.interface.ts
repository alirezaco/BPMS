import { PeriodEnum } from 'infrastructure/enum';

export interface AutoPayQueue<T> {
  type: PeriodEnum;
  autopay: T[];
}
