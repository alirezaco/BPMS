import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProcessMaxAmountCommand } from './update-process-max-amount.command';
import { ProcessRepository } from 'domain/services';

@CommandHandler(UpdateProcessMaxAmountCommand)
export class UpdateProcessMaxAmountHandler
  implements ICommandHandler<UpdateProcessMaxAmountCommand>
{
  constructor(private readonly processRepository: ProcessRepository) {}

  async execute(command: UpdateProcessMaxAmountCommand) {
    const { processEntity, maxAmount } = command;

    // Update the process maxAmount
    processEntity.maxAmount = maxAmount;

    // Save the updated process entity
    await this.processRepository.updateOneById(processEntity);

    // Return the updated process entity
    return processEntity;
  }
}
