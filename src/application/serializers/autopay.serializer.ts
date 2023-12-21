import { AutoPayEntity, UISchemaEntity } from 'domain/models';
import { UISchemaSerializer } from './ui-schema.serializer';
import { ProcessSerializer } from './process.serializer';

export class AutoPaySerializer {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  restored_at: string;
  owner: string;
  tags: string[];
  user_id: string;
  process_id: string;
  name: string;
  max_amount: number;
  allowed_direct_debit: boolean;
  period: string;
  cron: string;
  is_active: boolean;
  last_run_at: string;
  processing_status: string;
  data: string;
  ui_schema: UISchemaSerializer[];
  process?: Pick<ProcessSerializer, 'id' | 'name'>;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
  };

  constructor(initial: AutoPayEntity) {
    this.id = initial?.id;
    this.created_at = initial?.createdAt.toISOString();
    this.updated_at = initial?.updatedAt?.toISOString();
    this.deleted_at = initial?.deletedAt?.toISOString();
    this.restored_at = initial?.restoreAt?.toISOString();
    this.owner = initial?.owner;
    this.user_id = initial?.userId;
    this.process_id = initial?.processId;
    this.name = initial?.name;
    this.max_amount = initial?.maxAmount;
    this.allowed_direct_debit = initial?.allowedDirectDebit;
    this.period = initial?.period;
    this.cron = initial?.cron;
    this.is_active = initial?.isActive;
    this.last_run_at = initial?.lastRunAt?.toISOString();
    this.processing_status = initial?.processingStatus;
    this.data = JSON.stringify(initial?.data || {});
    this.tags = initial?.tags;
    this.ui_schema = initial?.UISchema?.map(
      (schema) => new UISchemaSerializer(schema),
    );
    this.process = initial?.process;
    this.user = initial?.user && {
      id: initial?.user?.id,
      first_name: initial?.user?.firstName,
      last_name: initial?.user?.lastName,
      phone: initial?.user?.phone,
    };
  }
}
