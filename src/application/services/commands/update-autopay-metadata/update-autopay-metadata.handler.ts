import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AutoPayEntity } from 'domain/models';
import { AutoPayRepository } from 'domain/services';
import { UpdateAutopayMetadataCommand } from './update-autopay-metadata.command';

@CommandHandler(UpdateAutopayMetadataCommand)
export class UpdateAutopayMetadataHandler
  implements ICommandHandler<UpdateAutopayMetadataCommand>
{
  constructor(private readonly autopayRepository: AutoPayRepository) {}

  async execute({
    autopayEntity,
    metadata,
  }: UpdateAutopayMetadataCommand): Promise<AutoPayEntity> {
    // Update the autopay metadata and cron
    autopayEntity.metadata = metadata;

    // Save the updated autopay entity
    await this.autopayRepository.updateOneById(autopayEntity);

    // Return the updated autopay entity
    return autopayEntity;
  }
}
