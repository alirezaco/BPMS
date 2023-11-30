import { ProcessEntity } from 'domain/models';

export class CreateProcessCommand {
  constructor(public processEntity: ProcessEntity) {}
}
