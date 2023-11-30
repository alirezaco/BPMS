import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProcessRolesCommand } from './update-process-roles.command';
import { ProcessRepository } from 'domain/services';

@CommandHandler(UpdateProcessRolesCommand)
export class UpdateProcessRolesHandler
  implements ICommandHandler<UpdateProcessRolesCommand>
{
  constructor(private readonly processRepository: ProcessRepository) {}

  async execute(command: UpdateProcessRolesCommand) {
    const { processEntity, roles } = command;

    // Update the process roles
    processEntity.roles = roles;

    // Save the updated process entity
    await this.processRepository.updateOneById(processEntity);

    // Return the updated process entity
    return processEntity;
  }
}
