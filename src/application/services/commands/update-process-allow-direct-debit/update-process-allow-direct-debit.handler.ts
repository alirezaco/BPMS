import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProcessAllowedDirectDebitCommand } from './update-process-allow-direct-debit.command';
import { ProcessRepository } from 'domain/services';

@CommandHandler(UpdateProcessAllowedDirectDebitCommand)
export class UpdateProcessAllowedDirectDebitHandler
  implements ICommandHandler<UpdateProcessAllowedDirectDebitCommand>
{
  constructor(private readonly processRepository: ProcessRepository) {}

  async execute(command: UpdateProcessAllowedDirectDebitCommand) {
    const { processEntity, allowedDirectDebit } = command;

    // Update the process allowedDirectDebit
    processEntity.allowedDirectDebit = allowedDirectDebit;

    // Save the updated process entity
    await this.processRepository.updateOneById(processEntity);

    // Return the updated process entity
    return processEntity;
  }
}
