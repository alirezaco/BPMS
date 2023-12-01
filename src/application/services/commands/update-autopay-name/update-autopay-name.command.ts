import { AutoPayEntity } from 'domain/models';

export class UpdateAutoPayNameCommand {
  constructor(public autopayEntity: AutoPayEntity, public name: string) {}
}
