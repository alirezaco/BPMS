import { AutoPayEntity } from 'domain/models';

export class UpdateAutopayDirectDebitCommand {
  constructor(
    public autopayEntity: AutoPayEntity,
    public allowedDirectDebit: boolean,
  ) {}
}
