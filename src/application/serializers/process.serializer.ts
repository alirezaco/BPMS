import { ProcessEntity } from 'domain/models';
import { StepSerializer } from './step.serializer';
import { UISchemaSerializer } from './ui-schema.serializer';
import { RepeatSerializer } from './repeat.serializer';

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
  default_fail_step?: string;
  allowed_direct_debit?: boolean;
  max_amount?: number;
  period?: string;
  cron?: string;
  ui_schema: UISchemaSerializer[];
  steps: StepSerializer[];
  data: string;
  is_active: boolean;
  min_amount: number;
  service_name: string;
  is_repeatable?: boolean;
  repeat?: RepeatSerializer;

  constructor(initial: ProcessEntity) {
    this.id = initial?.id;
    this.owner = initial?.owner;
    this.created_at = initial?.createdAt.toISOString();
    this.updated_at = initial?.updatedAt?.toISOString();
    this.deleted_at = initial?.deletedAt?.toISOString();
    this.restore_at = initial?.restoreAt?.toISOString();
    this.tags = initial?.tags;
    this.name = initial?.name;
    this.roles = initial?.roles;
    this.default_fail_step = initial?.defaultFailStep;
    this.allowed_direct_debit = initial?.allowedDirectDebit;
    this.max_amount = initial?.maxAmount;
    this.period = initial?.period;
    this.cron = initial?.cron;
    this.ui_schema = initial?.UISchema?.map(
      (schema) => new UISchemaSerializer(schema),
    );
    this.steps = initial?.steps?.map((step) => new StepSerializer(step));
    this.data = JSON.stringify(initial?.data || {});
    this.is_active = initial?.isActive;
    this.min_amount = initial?.minAmount;
    this.service_name = initial?.serviceName;
    this.is_repeatable = initial?.isRepeatable;
    this.repeat = initial?.repeat && new RepeatSerializer(initial?.repeat);
  }
}
