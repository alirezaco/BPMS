import { AutoPayEntity } from 'domain/models';

export class UpdateAutoPayDataCommand {
  constructor(
    public autopayEntity: AutoPayEntity,
    public data: Record<string, any>,
  ) {}
}
