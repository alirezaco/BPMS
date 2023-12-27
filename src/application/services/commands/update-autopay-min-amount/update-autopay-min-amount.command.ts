import { AutoPayEntity } from 'domain/models';

export class UpdateAutopayMinAmountCommand {
  constructor(public autopayEntity: AutoPayEntity, public minAmount: number) {}
}
