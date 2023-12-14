import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProcessCommand } from './create-process.command';
import {
  ComparisonStepEntity,
  DataParamEntity,
  ProcessEntity,
  StepEntity,
} from 'domain/models';
import { ProcessFactory, ProcessRepository } from 'domain/services';
import {
  MessageEnum,
  PeriodEnum,
  ProcessStepTypeEnum,
  SourceEnum,
} from 'infrastructure/enum';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(CreateProcessCommand)
export class CreateProcessHandler
  implements ICommandHandler<CreateProcessCommand>
{
  constructor(
    private readonly processFactory: ProcessFactory,
    private readonly processRepository: ProcessRepository,
  ) {}

  async checkUniqName(name: string): Promise<void> {
    const process = await this.processRepository.findOneByName(name);
    if (process?.id) {
      throw new BadRequestException(MessageEnum.DUPLICATE_PROCESS_NAME);
    }
  }

  cehckStepNames(steps: StepEntity[]): void {
    const names = steps.map((x) => x.name);

    const duplicatedNames = names.filter(
      (name, index) => names.indexOf(name) !== index,
    );

    if (duplicatedNames.length > 0) {
      throw new BadRequestException(MessageEnum.DUPLICATE_STEP_NAME);
    }
  }

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

  checkValidGrpcSteps(step: StepEntity, processEntity: ProcessEntity): void {
    if (!step.grpc)
      throw new BadRequestException(MessageEnum.INVALID_STEP_TYPE);

    step.grpc.metadata.map((x) => {
      this.checkParams(x, processEntity.validationData, processEntity.data);
    });

    step.grpc.payload.map((x) => {
      this.checkParams(x, processEntity.validationData, processEntity.data);
    });
  }

  checkValidApiSteps(step: StepEntity, processEntity: ProcessEntity): void {
    if (!step.api) throw new BadRequestException(MessageEnum.INVALID_STEP_TYPE);

    step.api.headers.map((x) => {
      this.checkParams(x, processEntity.validationData, processEntity.data);
    });

    step.api.body.map((x) => {
      this.checkParams(x, processEntity.validationData, processEntity.data);
    });

    step.api.query.map((x) => {
      this.checkParams(x, processEntity.validationData, processEntity.data);
    });

    step.api.params.map((x) => {
      this.checkParams(x, processEntity.validationData, processEntity.data);
    });
  }

  checkValidComparison(
    comparison: ComparisonStepEntity,
    processEntity: ProcessEntity,
  ): void {
    if (comparison.left)
      this.checkParams(
        comparison.left,
        processEntity.validationData,
        processEntity.data,
      );

    if (comparison.right)
      this.checkParams(
        comparison.right,
        processEntity.validationData,
        processEntity.data,
      );

    comparison.children?.map((x) => {
      this.checkValidComparison(x, processEntity);
    });
  }

  checkValidComparisonSteps(
    step: StepEntity,
    processEntity: ProcessEntity,
  ): void {
    if (!step.comparison)
      throw new BadRequestException(MessageEnum.INVALID_STEP_TYPE);

    this.checkValidComparison(step.comparison, processEntity);
  }

  checkFailStep(steps: StepEntity[], failStep?: string) {
    if (failStep && !steps.find((x) => x.name === failStep)) {
      throw new BadRequestException(MessageEnum.INVALID_STEP_TYPE);
    }
  }

  checkSteps(processEntity: ProcessEntity): void {
    if (processEntity.steps.length < 1) {
      throw new BadRequestException(MessageEnum.INVALID_PROCESS_STEPS);
    }

    this.cehckStepNames(processEntity.steps);

    processEntity.steps.map((x) => {
      if (x.type === ProcessStepTypeEnum.GRPC) {
        this.checkValidGrpcSteps(x, processEntity);
      } else if (x.type === ProcessStepTypeEnum.API) {
        this.checkValidApiSteps(x, processEntity);
      } else if (x.type === ProcessStepTypeEnum.COMPARISON) {
        this.checkValidComparisonSteps(x, processEntity);
      }

      this.checkFailStep(processEntity.steps, x.failStep);
    });
  }

  checkPeriod(processEntity: ProcessEntity): void {
    if (processEntity.period === PeriodEnum.CRON && !processEntity.cron) {
      throw new BadRequestException(MessageEnum.INVALID_PERIOD);
    }
  }

  setFinalSteps(processEntity: ProcessEntity) {
    processEntity.steps[processEntity.steps.length - 1].isFinal = true;

    processEntity.steps = processEntity.steps.map((x) => {
      if (x.isSync) {
        x.isFinal = true;
      }
      return x;
    });
    return processEntity;
  }

  async execute({
    processEntity,
  }: CreateProcessCommand): Promise<ProcessEntity> {
    await this.checkUniqName(processEntity.name);
    this.checkSteps(processEntity);
    this.checkFailStep(processEntity.steps, processEntity.defaultFailStep);
    this.checkPeriod(processEntity);

    processEntity = this.setFinalSteps(processEntity);

    return this.processFactory.create(processEntity);
  }
}
