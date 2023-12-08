import { AutoPayEntity } from 'domain/models';

export class UpdateAutopayLastRunCommand {
  constructor(public autopayEntity: AutoPayEntity, public lastRunAt: Date) {}
}
