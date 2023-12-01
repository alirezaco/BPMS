import { PeriodEnum, ProcessingStatusEnum } from 'infrastructure/enum';
import { BaseEntity } from './base.entity';

export class AutoPayEntity extends BaseEntity {
  public name: string;
  public userId: string;
  public processId: string;
  public maxAmount: number;
  public allowedDirectDebit: boolean;
  public period: PeriodEnum;
  public cron?: string;
  public isActive: boolean;
  public lastRunAt: Date;
  public processingStatus: ProcessingStatusEnum;
  public data: Record<string, any>;

  constructor(initial: Partial<AutoPayEntity>) {
    super(initial);

    this.name = initial?.name;
    this.userId = initial?.userId;
    this.processId = initial?.processId;
    this.maxAmount = initial?.maxAmount;
    this.allowedDirectDebit = initial?.allowedDirectDebit || false;
    this.period = initial?.period;
    this.cron = initial?.cron;
    this.isActive = initial?.isActive || true;
    this.lastRunAt = initial?.lastRunAt;
    this.processingStatus =
      initial?.processingStatus || ProcessingStatusEnum.PENDING;
    this.data = initial?.data || {};
  }
}
