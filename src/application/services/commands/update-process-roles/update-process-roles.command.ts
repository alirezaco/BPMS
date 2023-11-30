import { ProcessEntity } from 'domain/models';

export class UpdateProcessRolesCommand {
  constructor(public processEntity: ProcessEntity, public roles: string[]) {}
}
