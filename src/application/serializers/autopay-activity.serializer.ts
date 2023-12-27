import { AutoPayActivityEntity } from 'domain/models';
import { ProcessSerializer } from './process.serializer';
import { AutoPaySerializer } from './autopay.serializer';

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
  process?: Pick<ProcessSerializer, 'id' | 'name' | 'service_name'>;
  autopay?: Pick<AutoPaySerializer, 'id' | 'name'>;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
  };

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
    this.successful_steps = initial?.successfulSteps.map((x) => x[0]);
    this.failed_steps = initial?.failedSteps.map((x) => x[0]);
    this.has_payment = initial?.hasPayment;
    this.payment_amount = initial?.paymentAmount;
    this.owner = initial?.owner;
    this.process = initial?.process && {
      id: initial?.process?.id,
      name: initial?.process?.name,
      service_name: initial?.process?.serviceName,
    };
    this.autopay = initial?.autopay && {
      id: initial?.autopay?.id,
      name: initial?.autopay?.name,
    };
    this.user = initial?.user && {
      id: initial?.user?.id,
      first_name: initial?.user?.firstName,
      last_name: initial?.user?.lastName,
      phone: initial?.user?.phone,
    };
  }
}
