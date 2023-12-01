import { ProcessRepository } from 'domain/services';
import { DeleteProcessCommand } from './delete-process.command';
import { NotFoundException } from '@nestjs/common';
import { MessageEnum } from 'infrastructure/enum';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(DeleteProcessCommand)
export class DeleteProcessHandler
  implements ICommandHandler<DeleteProcessCommand>
{
  constructor(private readonly processRepository: ProcessRepository) {}

  async execute(command: DeleteProcessCommand): Promise<void> {
    // Retrieve the process entity from the repository
    const process = await this.processRepository.findOneById(command.id);

    if (process) {
      // Delete the process
      await this.processRepository.deleteOne(process.id);
    } else {
      // Handle the case when the process is not found
      throw new NotFoundException(MessageEnum.PROCESS_NOT_FOUND);
    }
  }
}
