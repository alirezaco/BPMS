import { ActivityStatusEnum } from 'infrastructure/enum';
import { BaseEntity } from './base.entity';

export class AutoPayActivityEntity extends BaseEntity {
  autopayId: string;
  processId: string;
  status: ActivityStatusEnum;
  runningTime: number;
  successfulSteps?: string[];
  failedSteps?: string[];
  hasPayment?: boolean;
  paymentAmount?: number;

  constructor(initial: Partial<AutoPayActivityEntity>) {
    super(initial);

    this.autopayId = initial?.autopayId;
    this.processId = initial?.processId;
    this.status = initial?.status;
    this.runningTime = initial?.runningTime;
    this.successfulSteps = initial?.successfulSteps || [];
    this.failedSteps = initial?.failedSteps || [];
    this.hasPayment = initial?.hasPayment || false;
    this.paymentAmount = initial?.paymentAmount || 0;
  }
}
