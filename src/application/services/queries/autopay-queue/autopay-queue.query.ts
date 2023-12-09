import { PeriodEnum } from 'infrastructure/enum';

export class AutopayQueueQuery {
  constructor(public period: PeriodEnum) {}
}
