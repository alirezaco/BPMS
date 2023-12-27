import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProcessMinAmountCommand } from './update-process-min-amount.command';
import { ProcessRepository } from 'domain/services';

@CommandHandler(UpdateProcessMinAmountCommand)
export class UpdateProcessMinAmountHandler
  implements ICommandHandler<UpdateProcessMinAmountCommand>
{
  constructor(private readonly processRepository: ProcessRepository) {}

  async execute(command: UpdateProcessMinAmountCommand) {
    const { processEntity, minAmount } = command;

    // Update the process minAmount
    processEntity.minAmount = minAmount;

    // Save the updated process entity
    await this.processRepository.updateOneById(processEntity);

    // Return the updated process entity
    return processEntity;
  }
}
