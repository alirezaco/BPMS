import { ProcessEntity } from 'domain/models';
import cronstrue from 'cronstrue/i18n';

export class ProcessesSerializer {
  id: string;
  owner: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  restore_at?: string;
  tags: string[];
  name: string;
  roles: string[];
  allowed_direct_debit?: boolean | undefined;
  max_amount?: number | undefined;
  period?: string | undefined;
  cron?: string | undefined;
  is_active: boolean;
  min_amount: number;
  service_name: string;
  cron_desc?: string;

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
    this.allowed_direct_debit = initial?.allowedDirectDebit;
    this.max_amount = initial?.maxAmount;
    this.period = initial?.period;
    this.cron = initial?.cron;
    this.is_active = initial?.isActive;
    this.min_amount = initial?.minAmount;
    this.service_name = initial?.serviceName;
    this.cron_desc = initial?.cron
      ? cronstrue.toString(initial?.cron, {
          locale: 'fa',
          use24HourTimeFormat: true,
          throwExceptionOnParseError: false,
        })
      : undefined;
  }
}
