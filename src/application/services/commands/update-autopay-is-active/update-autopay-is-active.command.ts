import { AutoPayEntity } from 'domain/models';

export class UpdateAutopayIsActiveCommand {
  constructor(public autopayEntity: AutoPayEntity, public isActive: boolean) {}
}
