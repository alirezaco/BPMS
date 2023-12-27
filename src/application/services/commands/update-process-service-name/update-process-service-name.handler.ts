import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProcessServiceNameCommand } from './update-process-service-name.command';
import { ProcessRepository } from 'domain/services';

@CommandHandler(UpdateProcessServiceNameCommand)
export class UpdateProcessServiceNameHandler
  implements ICommandHandler<UpdateProcessServiceNameCommand>
{
  constructor(private readonly processRepository: ProcessRepository) {}

  async execute(command: UpdateProcessServiceNameCommand) {
    const { processEntity, serviceName } = command;

    // Update the process serviceName
    processEntity.serviceName = serviceName;

    // Save the updated process entity
    await this.processRepository.updateOneById(processEntity);

    // Return the updated process entity
    return processEntity;
  }
}
