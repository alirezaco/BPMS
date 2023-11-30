import { ProcessEntity } from 'domain/models';
import { StepSerializer } from './step.serializer';

export class ProcessSerializer {
  id: string;
  owner: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  restore_at?: string;
  tags: string[];
  name: string;
  roles: string[];
  default_fail_step?: string | undefined;
  allowed_direct_debit?: boolean | undefined;
  max_amount?: number | undefined;
  period?: string | undefined;
  cron?: string | undefined;
  validation_data: string | undefined;
  steps: StepSerializer[];
  data: string;

  constructor(initial: ProcessEntity) {
    this.id = initial?.id;
    this.owner = initial?.owner;
    this.created_at = initial?.createdAt.toISOString();
    this.updated_at = initial?.updatedAt.toISOString();
    this.deleted_at = initial?.deletedAt.toISOString();
    this.restore_at = initial?.restoreAt.toISOString();
    this.tags = initial?.tags;
    this.name = initial?.name;
    this.roles = initial?.roles;
    this.default_fail_step = initial?.defaultFailStep;
    this.allowed_direct_debit = initial?.allowedDirectDebit;
    this.max_amount = initial?.maxAmount;
    this.period = initial?.period;
    this.cron = initial?.cron;
    this.validation_data = JSON.stringify(initial?.validationData || {});
    this.steps = initial?.steps?.map((step) => new StepSerializer(step));
    this.data = JSON.stringify(initial?.data || {});
  }
}
