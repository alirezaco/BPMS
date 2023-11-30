import { ProcessEntity } from 'domain/models';

export class UpdateProcessAllowedDirectDebitCommand {
  constructor(
    public processEntity: ProcessEntity,
    public allowedDirectDebit: boolean,
  ) {}
}
