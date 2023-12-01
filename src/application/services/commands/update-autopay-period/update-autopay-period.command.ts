import { AutoPayEntity } from "domain/models";
import { PeriodEnum } from "infrastructure/enum";

export class UpdateAutopayPeriodCommand {
  constructor(
    public autopayEntity: AutoPayEntity,
    public period: PeriodEnum,
    public cron?: string,
  ) {}
}