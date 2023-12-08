import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { UpdateAutopayLastRunCommand } from './update-autopay-last-run.command';
import { AutoPayRepository } from 'domain/services';

@CommandHandler(UpdateAutopayLastRunCommand)
export class UpdateAutopayLastRunHandler
  implements ICommandHandler<UpdateAutopayLastRunCommand>
{
  constructor(private readonly autopayRepository: AutoPayRepository) {}

  async execute(command: UpdateAutopayLastRunCommand): Promise<void> {
    const { autopayEntity, lastRunAt } = command;

    // Update the autopay last run date
    autopayEntity.lastRunAt = lastRunAt;

    // Save the updated autopay entity
    await this.autopayRepository.updateOneById(autopayEntity);
  }
}
