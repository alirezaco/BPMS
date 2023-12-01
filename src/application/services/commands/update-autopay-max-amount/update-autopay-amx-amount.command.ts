import { AutoPayEntity } from 'domain/models';

export class UpdateAutopayMaxAmountCommand {
  constructor(public autopayEntity: AutoPayEntity, public maxAmount: number) {}
}
