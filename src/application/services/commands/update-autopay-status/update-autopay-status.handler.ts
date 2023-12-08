import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateAutopayStatusCommand } from './update-autopay-status.command';
import { AutoPayRepository } from 'domain/services';

@CommandHandler(UpdateAutopayStatusCommand)
export class UpdateAutopayStatusHandler
  implements ICommandHandler<UpdateAutopayStatusCommand>
{
  constructor(private readonly autopayRepository: AutoPayRepository) {}

  async execute(command: UpdateAutopayStatusCommand): Promise<void> {
    const { autopayEntity, status } = command;

    // Update the autopay processing status
    autopayEntity.processingStatus = status;

    // Save the updated autopay entity
    await this.autopayRepository.updateOneById(autopayEntity);
  }
}
