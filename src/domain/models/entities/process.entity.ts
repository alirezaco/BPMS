import { PeriodEnum } from 'infrastructure/enum';
import { StepEntity } from './step.entity';
import { BaseEntity } from './base.entity';
import { UISchemaEntity } from './ui-schema.entity';
import { RepeatEntity } from './repeat.entity';

export class ProcessEntity extends BaseEntity {
  public name: string;
  public roles: string[];
  public defaultFailStep?: string;
  public allowedDirectDebit?: boolean;
  public maxAmount?: number;
  public minAmount?: number;
  public period?: PeriodEnum;
  public cron?: string;
  public validationData?: Record<string, any>;
  public steps: StepEntity[];
  public data: Record<string, any>;
  public isActive: boolean;
  public UISchema?: UISchemaEntity[];
  public serviceName: string;
  public isRepeatable?: boolean;
  public repeat?: RepeatEntity;

  constructor(initial: Partial<ProcessEntity>) {
    super(initial);

    this.name = initial?.name;
    this.roles = initial?.roles;
    this.defaultFailStep = initial?.defaultFailStep;
    this.allowedDirectDebit = initial?.allowedDirectDebit;
    this.maxAmount = initial?.maxAmount;
    this.period = initial?.period;
    this.cron = initial?.cron;
    this.validationData = initial?.validationData || {};
    this.steps = initial?.steps;
    this.data = initial?.data || {};
    this.isActive = initial?.isActive || false;
    this.UISchema = initial?.UISchema || [];
    this.minAmount = initial?.minAmount || 0;
    this.serviceName = initial?.serviceName;
    this.isRepeatable = initial?.isRepeatable || false;
    this.repeat = initial?.repeat;
  }
}
