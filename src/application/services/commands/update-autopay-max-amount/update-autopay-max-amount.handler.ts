import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateAutopayMaxAmountCommand } from './update-autopay-amx-amount.command';
import { AutoPayRepository } from 'domain/services';

@CommandHandler(UpdateAutopayMaxAmountCommand)
export class UpdateAutoPayMaxAmountHandler
  implements ICommandHandler<UpdateAutopayMaxAmountCommand>
{
  constructor(private readonly autopayRepository: AutoPayRepository) {}

  async execute(command: UpdateAutopayMaxAmountCommand) {
    const { autopayEntity, maxAmount } = command;

    // Update the autopay maxAmount
    autopayEntity.maxAmount = maxAmount;

    // Save the updated autopay entity
    await this.autopayRepository.updateOneById(autopayEntity);

    // Return the updated autopay entity
    return autopayEntity;
  }
}
