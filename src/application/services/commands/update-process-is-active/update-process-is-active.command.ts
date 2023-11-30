import { ProcessEntity } from 'domain/models';

export class UpdateProcessIsActiveCommand {
  constructor(public processEntity: ProcessEntity, public isActive: boolean) {}
}
