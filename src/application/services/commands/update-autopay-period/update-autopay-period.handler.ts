import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AutoPayEntity, ProcessEntity } from 'domain/models';
import { AutoPayRepository, ProcessRepository } from 'domain/services';
import { MessageEnum, PeriodEnum } from 'infrastructure/enum';
import { UpdateAutopayPeriodCommand } from './update-autopay-period.command';

@CommandHandler(UpdateAutopayPeriodCommand)
export class UpdateAutopayPeriodHandler
  implements ICommandHandler<UpdateAutopayPeriodCommand>
{
  constructor(
    private readonly autopayRepository: AutoPayRepository,
    private readonly processRepository: ProcessRepository,
  ) {}

  async checkAndSetPeriod(
    autopayEntity: AutoPayEntity,
    processEntity: ProcessEntity,
  ) {
    if (autopayEntity.period === PeriodEnum.CRON && !autopayEntity.cron) {
      throw new Error(MessageEnum.INVALID_PERIOD);
    }

    if (processEntity.period) {
      throw new Error(MessageEnum.INVALID_PERIOD);
    }
  }

  async execute({
    autopayEntity,
    period,
    cron,
  }: UpdateAutopayPeriodCommand): Promise<AutoPayEntity> {
    const process = await this.processRepository.findOneById(
      autopayEntity.processId,
    );

    // Update the autopay period and cron
    autopayEntity.period = period;
    autopayEntity.cron = cron;

    this.checkAndSetPeriod(autopayEntity, process);

    // Save the updated autopay entity
    await this.autopayRepository.updateOneById(autopayEntity);

    // Return the updated autopay entity
    return autopayEntity;
  }
}
