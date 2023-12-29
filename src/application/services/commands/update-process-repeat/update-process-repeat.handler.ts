import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProcessRepeatCommand } from './update-process-repeat.command';
import { DataParamEntity, ProcessEntity } from 'domain/models';
import { MessageEnum, SourceEnum } from 'infrastructure/enum';
import { BadRequestException } from '@nestjs/common';
import { ProcessRepository } from 'domain/services';

@CommandHandler(UpdateProcessRepeatCommand)
export class UpdateProcessRepeatHandler
  implements ICommandHandler<UpdateProcessRepeatCommand>
{
  constructor(private readonly processRepository: ProcessRepository) {}

  checkParams(
    dataParam: DataParamEntity,
    validationData: Record<string, any>,
    processData: Record<string, any>,
  ): void {
    if (
      dataParam.source === SourceEnum.AUTO_PAY &&
      !validationData['properties'][dataParam.sourceKey]
    ) {
      throw new BadRequestException(MessageEnum.INVALID_STEP_TYPE);
    } else if (
      dataParam.source === SourceEnum.PROCESS &&
      !processData[dataParam.sourceKey]
    ) {
      throw new BadRequestException(MessageEnum.INVALID_STEP_TYPE);
    }
  }

  checkRepeat(processEntity: ProcessEntity) {
    if (!processEntity.isRepeatable) return;

    if (!processEntity.repeat)
      throw new BadRequestException(MessageEnum.INVALID_PROCESS_REPEATABLE);

    if (
      processEntity.steps.filter(
        (x) =>
          x.name === processEntity.repeat.startStep ||
          x.name === processEntity.repeat.endStep,
      ).length !== 2
    )
      throw new BadRequestException(MessageEnum.INVALID_PROCESS_REPEATABLE);

    if (processEntity.repeat.endStep === processEntity.repeat.startStep)
      throw new BadRequestException(MessageEnum.INVALID_PROCESS_REPEATABLE);

    this.checkParams(
      processEntity.repeat.condition.variable,
      processEntity.validationData,
      processEntity.data,
    );
    this.checkParams(
      processEntity.repeat.counter.stepVar,
      processEntity.validationData,
      processEntity.data,
    );
    this.checkParams(
      processEntity.repeat.counter.initial,
      processEntity.validationData,
      processEntity.data,
    );
  }

  async execute({
    isRepeatable,
    processEntity,
    repeat,
  }: UpdateProcessRepeatCommand): Promise<ProcessEntity> {
    // Update the process repeat
    processEntity.repeat = repeat;
    processEntity.isRepeatable = isRepeatable;

    this.checkRepeat(processEntity);

    // Save the updated process entity
    await this.processRepository.updateOneById(processEntity);

    // Return the updated process entity
    return processEntity;
  }
}
