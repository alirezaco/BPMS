import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAutopayCommand } from './create-autopay.command';
import { AutoPayFactory, ProcessRepository } from 'domain/services';
import { AutoPayEntity, ProcessEntity } from 'domain/models';
import { MessageEnum, PeriodEnum } from 'infrastructure/enum';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { fromJson } from 'json-joi-converter';

@CommandHandler(CreateAutopayCommand)
export class CreateAutopayHandler
  implements ICommandHandler<CreateAutopayCommand>
{
  constructor(
    private readonly autoPayFactory: AutoPayFactory,
    private readonly processRepository: ProcessRepository,
  ) {}

  async checkExistProcess(id: string): Promise<ProcessEntity> {
    const process = await this.processRepository.findOneById(id);

    if (!process) {
      throw new NotFoundException(MessageEnum.PROCESS_NOT_FOUND);
    }

    return process;
  }

  async checkDirectDebit(
    processEntity: ProcessEntity,
    autopayEntity: AutoPayEntity,
  ) {
    if (!processEntity.allowedDirectDebit && autopayEntity.allowedDirectDebit) {
      throw new NotFoundException(MessageEnum.DIRECT_DEBIT_NOT_ALLOWED);
    }
  }

  async checkAndSetPeriod(
    autopayEntity: AutoPayEntity,
    processEntity: ProcessEntity,
  ) {
    if (autopayEntity.period === PeriodEnum.CRON && !autopayEntity.cron) {
      throw new NotFoundException(MessageEnum.INVALID_PERIOD);
    }

    if (processEntity.period) {
      if (autopayEntity.period)
        throw new NotFoundException(MessageEnum.INVALID_PERIOD);

      autopayEntity.period = processEntity.period;
      autopayEntity.cron = processEntity.cron;
    }
  }

  async validatData(
    data: Record<string, any>,
    validationData: Record<string, any>,
  ) {
    try {
      const joiSchema = fromJson(validationData);

      await joiSchema.validateAsync(data);
    } catch (error) {
      throw new BadRequestException(MessageEnum.INVALID_DATA);
    }
  }

  async execute({
    autopayEntity,
  }: CreateAutopayCommand): Promise<AutoPayEntity> {
    const process = await this.checkExistProcess(autopayEntity.processId);

    this.checkDirectDebit(process, autopayEntity);

    await this.checkAndSetPeriod(autopayEntity, process);

    await this.validatData(autopayEntity.data, process.data);

    return this.autoPayFactory.create(autopayEntity);
  }
}
