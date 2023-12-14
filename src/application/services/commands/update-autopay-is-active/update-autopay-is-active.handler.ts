import { AutoPayRepository } from 'domain/services';
import { UpdateAutopayIsActiveCommand } from './update-autopay-is-active.command';
import { AutoPayEntity } from 'domain/models';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(UpdateAutopayIsActiveCommand)
export class UpdateAutopayIsActiveHandler
  implements ICommandHandler<UpdateAutopayIsActiveCommand>
{
  constructor(private readonly autopayRepository: AutoPayRepository) {}

  async execute(command: UpdateAutopayIsActiveCommand): Promise<AutoPayEntity> {
    const { autopayEntity, isActive } = command;

    // Update the autopay isActive status
    autopayEntity.isActive = isActive;

    // Save the updated autopay entity
    await this.autopayRepository.updateOneById(autopayEntity);

    // Return the updated autopay entity
    return autopayEntity;
  }
}
