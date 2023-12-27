import { PeriodEnum, ProcessingStatusEnum } from 'infrastructure/enum';
import { BaseEntity } from './base.entity';
import { UISchemaEntity } from './ui-schema.entity';
import { ProcessEntity } from './process.entity';

export class AutoPayEntity extends BaseEntity {
  public name: string;
  public userId: string;
  public processId: string;
  public maxAmount: number;
  public minAmount?: number;
  public allowedDirectDebit: boolean;
  public period: PeriodEnum;
  public cron?: string;
  public isActive: boolean;
  public lastRunAt: Date;
  public processingStatus: ProcessingStatusEnum;
  public data: Record<string, any>;
  public UISchema?: UISchemaEntity[];
  public process?: Pick<ProcessEntity, 'id' | 'name' | 'serviceName'>;
  public metadata?: Record<string, any>;
  public user?: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
  };

  constructor(initial: Partial<AutoPayEntity>) {
    super(initial);

    this.name = initial?.name;
    this.userId = initial?.userId;
    this.processId = initial?.processId;
    this.maxAmount = initial?.maxAmount;
    this.allowedDirectDebit =
      initial?.allowedDirectDebit == undefined
        ? false
        : initial?.allowedDirectDebit;
    this.period = initial?.period;
    this.cron = initial?.cron;
    this.isActive = initial?.isActive == undefined ? true : initial?.isActive;
    this.lastRunAt = initial?.lastRunAt;
    this.processingStatus =
      initial?.processingStatus || ProcessingStatusEnum.PENDING;
    this.data = initial?.data || {};
    this.process = initial?.process;
    this.user = initial?.user;
    this.metadata = initial?.metadata;
    this.minAmount = initial?.minAmount || 0;
  }

  public setUISchema(uiSchema: UISchemaEntity[]) {
    this.UISchema = uiSchema;
  }

  public setLastRunAt() {
    this.lastRunAt = new Date();
  }

  public setUser(user: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
  }) {
    this.user = user;
  }
}
