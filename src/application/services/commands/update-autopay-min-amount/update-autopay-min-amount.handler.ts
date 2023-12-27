import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateAutopayMinAmountCommand } from './update-autopay-min-amount.command';
import { AutoPayRepository } from 'domain/services';

@CommandHandler(UpdateAutopayMinAmountCommand)
export class UpdateAutoPayMinAmountHandler
  implements ICommandHandler<UpdateAutopayMinAmountCommand>
{
  constructor(private readonly autopayRepository: AutoPayRepository) {}

  async execute(command: UpdateAutopayMinAmountCommand) {
    const { autopayEntity, minAmount } = command;

    // Update the autopay minAmount
    autopayEntity.minAmount = minAmount;

    // Save the updated autopay entity
    await this.autopayRepository.updateOneById(autopayEntity);

    // Return the updated autopay entity
    return autopayEntity;
  }
}
