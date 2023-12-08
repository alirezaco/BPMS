import { AutoPayEntity } from 'domain/models';
import { ProcessingStatusEnum } from 'infrastructure/enum';

export class UpdateAutopayStatusCommand {
  constructor(
    public autopayEntity: AutoPayEntity,
    public status: ProcessingStatusEnum,
  ) {}
}
