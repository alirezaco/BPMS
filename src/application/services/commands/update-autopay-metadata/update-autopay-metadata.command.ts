import { AutoPayEntity } from 'domain/models';

export class UpdateAutopayMetadataCommand {
  constructor(
    public autopayEntity: AutoPayEntity,
    public metadata: Record<string, any>,
  ) {}
}
