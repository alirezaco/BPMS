import { ProcessEntity } from 'domain/models';
import { PeriodEnum } from 'infrastructure/enum';

export class UpdateProcessPeriodCommand {
  constructor(
    public processEntity: ProcessEntity,
    public period: PeriodEnum,
    public cron?: string,
  ) {}
}
