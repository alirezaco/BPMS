import { ProcessEntity } from 'domain/models';

export class UpdateProcessMinAmountCommand {
  constructor(public processEntity: ProcessEntity, public minAmount: number) {}
}
