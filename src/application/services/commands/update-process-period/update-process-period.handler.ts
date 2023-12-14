import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProcessPeriodCommand } from './update-process-period.command';
import { ProcessRepository } from 'domain/services';
import { MessageEnum, PeriodEnum } from 'infrastructure/enum';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(UpdateProcessPeriodCommand)
export class UpdateProcessPeriodHandler
  implements ICommandHandler<UpdateProcessPeriodCommand>
{
  constructor(private readonly processRepository: ProcessRepository) {}

  checkPeriod(period: PeriodEnum, cron?: string): void {
    if (period === PeriodEnum.CRON && !cron) {
      throw new BadRequestException(MessageEnum.INVALID_PERIOD);
    }
  }

  async execute(command: UpdateProcessPeriodCommand) {
    const { processEntity, period, cron } = command;

    this.checkPeriod(period, cron);

    // Update the process period
    processEntity.period = period;
    processEntity.cron = cron;

    // Save the updated process entity
    await this.processRepository.updateOneById(processEntity);

    // Return the updated process entity
    return processEntity;
  }
}
