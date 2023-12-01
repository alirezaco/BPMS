import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateAutoPayNameCommand } from './update-autopay-name.command';
import { AutoPayRepository } from 'domain/services';

@CommandHandler(UpdateAutoPayNameCommand)
export class UpdateAutoPayNameHandler
  implements ICommandHandler<UpdateAutoPayNameCommand>
{
  constructor(private readonly autopayRepository: AutoPayRepository) {}

  async execute(command: UpdateAutoPayNameCommand) {
    const { autopayEntity, name } = command;

    // Update the autopay name
    autopayEntity.name = name;

    // Save the updated autopay entity
    await this.autopayRepository.updateOneById(autopayEntity);

    // Return the updated autopay entity
    return autopayEntity;
  }
}
