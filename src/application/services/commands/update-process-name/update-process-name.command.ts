import { ProcessEntity } from 'domain/models';

export class UpdateProcessNameCommand {
  constructor(public processEntity: ProcessEntity, public name: string) {}
}
