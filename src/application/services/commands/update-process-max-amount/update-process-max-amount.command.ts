import { ProcessEntity } from 'domain/models';

export class UpdateProcessMaxAmountCommand {
  constructor(public processEntity: ProcessEntity, public maxAmount: number) {}
}
