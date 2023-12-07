import { AutoPayActivityEntity } from 'domain/models';

export class AutoPayActivitySerializer {
  id: string;
  owner: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  restored_at?: string;
  tags: string[];
  autopay_id: string;
  process_id: string;
  status: string;
  running_time: number;
  successful_steps: string[];
  failed_steps: string[];
  has_payment: boolean;
  payment_amount: number;

  constructor(initial: AutoPayActivityEntity) {
    this.id = initial?.id;
    this.created_at = initial?.createdAt.toISOString();
    this.updated_at = initial?.updatedAt?.toISOString();
    this.deleted_at = initial?.deletedAt?.toISOString();
    this.restored_at = initial?.restoreAt?.toISOString();
    this.tags = initial?.tags;
    this.autopay_id = initial?.autopayId;
    this.process_id = initial?.processId;
    this.status = initial?.status;
    this.running_time = initial?.runningTime;
    this.successful_steps = initial?.successfulSteps;
    this.failed_steps = initial?.failedSteps;
    this.has_payment = initial?.hasPayment;
    this.payment_amount = initial?.paymentAmount;
    this.owner = initial?.owner;
  }
}
