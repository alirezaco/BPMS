import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProcessIsActiveCommand } from './update-process-is-active.command';
import { ProcessRepository } from 'domain/services';

@CommandHandler(UpdateProcessIsActiveCommand)
export class UpdateProcessIsActiveHandler
  implements ICommandHandler<UpdateProcessIsActiveCommand>
{
  constructor(private readonly processRepository: ProcessRepository) {}

  async execute(command: UpdateProcessIsActiveCommand) {
    const { processEntity, isActive } = command;

    // Update the process isActive
    processEntity.isActive = isActive;

    // Save the updated process entity
    await this.processRepository.updateOneById(processEntity);

    // Return the updated process entity
    return processEntity;
  }
}
