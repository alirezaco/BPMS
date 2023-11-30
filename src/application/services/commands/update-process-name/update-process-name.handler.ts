import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProcessNameCommand } from './update-process-name.command';
import { ProcessRepository } from 'domain/services';
import { MessageEnum } from 'infrastructure/enum';
import { ProcessEntity } from 'domain/models';

@CommandHandler(UpdateProcessNameCommand)
export class UpdateProcessNameHandler
  implements ICommandHandler<UpdateProcessNameCommand>
{
  constructor(private readonly processRepository: ProcessRepository) {}

  async cehckUniqName(
    processEntity: ProcessEntity,
    name: string,
  ): Promise<void> {
    const process = await this.processRepository.findOneByName(name);
    if (process && process.id !== processEntity.id) {
      throw new Error(MessageEnum.DUPLICATE_PROCESS_NAME);
    }
  }

  async execute(command: UpdateProcessNameCommand) {
    const { processEntity, name } = command;

    await this.cehckUniqName(processEntity, name);

    // Update the process name
    processEntity.name = name;

    // Save the updated process entity
    await this.processRepository.updateOneById(processEntity);

    // Return the updated process entity
    return processEntity;
  }
}
