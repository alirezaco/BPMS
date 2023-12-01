import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateAutopayDirectDebitCommand } from './update-autopay-direct-debit.command';
import { AutoPayRepository, ProcessRepository } from 'domain/services';
import { AutoPayEntity, ProcessEntity } from 'domain/models';
import { MessageEnum } from 'infrastructure/enum';

@CommandHandler(UpdateAutopayDirectDebitCommand)
export class UpdateAutopayDirectDebitHandler
  implements ICommandHandler<UpdateAutopayDirectDebitCommand>
{
  constructor(
    private readonly autopayRepository: AutoPayRepository,
    private readonly processRepository: ProcessRepository,
  ) {}

  checkDirectDebit(processEntity: ProcessEntity, autopayEntity: AutoPayEntity) {
    if (!processEntity.allowedDirectDebit && autopayEntity.allowedDirectDebit) {
      throw new Error(MessageEnum.DIRECT_DEBIT_NOT_ALLOWED);
    }
  }

  async execute(command: UpdateAutopayDirectDebitCommand) {
    const { autopayEntity, allowedDirectDebit } = command;
    const process = await this.processRepository.findOneById(
      autopayEntity.processId,
    );

    // Update the autopay allowedDirectDebit
    autopayEntity.allowedDirectDebit = allowedDirectDebit;

    // Check if allowedDirectDebit is true
    this.checkDirectDebit(process, autopayEntity);

    // Save the updated autopay entity
    await this.autopayRepository.updateOneById(autopayEntity);

    // Return the updated autopay entity
    return autopayEntity;
  }
}
