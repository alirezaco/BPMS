import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProcessStepsCommand } from './update-process-steps.command';
import { ProcessRepository } from 'domain/services';
import {
  ComparisonStepEntity,
  DataParamEntity,
  ProcessEntity,
  StepEntity,
} from 'domain/models';
import {
  MessageEnum,
  ProcessStepTypeEnum,
  SourceEnum,
} from 'infrastructure/enum';

@CommandHandler(UpdateProcessStepsCommand)
export class UpdateProcessStepsHandler
  implements ICommandHandler<UpdateProcessStepsCommand>
{
  constructor(private readonly processRepository: ProcessRepository) {}

  cehckStepNames(steps: StepEntity[]): void {
    const names = steps.map((x) => x.name);

    const duplicatedNames = names.filter(
      (name, index) => names.indexOf(name) !== index,
    );

    if (duplicatedNames.length > 0) {
      throw new Error(MessageEnum.DUPLICATE_STEP_NAME);
    }
  }

  checkParams(
    dataParam: DataParamEntity,
    validationData: Record<string, any>,
    processData: Record<string, any>,
  ): void {
    if (
      dataParam.source === SourceEnum.AUTO_PAY &&
      !validationData[dataParam.sourceKey]
    ) {
      throw new Error(MessageEnum.INVALID_STEP_TYPE);
    } else if (
      dataParam.source === SourceEnum.PROCESS &&
      !processData[dataParam.sourceKey]
    ) {
      throw new Error(MessageEnum.INVALID_STEP_TYPE);
    }
  }

  checkValidGrpcSteps(step: StepEntity, processEntity: ProcessEntity): void {
    if (!step.grpc) throw new Error(MessageEnum.INVALID_STEP_TYPE);

    step.grpc.metadata.map((x) => {
      this.checkParams(x, processEntity.validationData, processEntity.data);
    });

    step.grpc.payload.map((x) => {
      this.checkParams(x, processEntity.validationData, processEntity.data);
    });
  }

  checkValidApiSteps(step: StepEntity, processEntity: ProcessEntity): void {
    if (!step.api) throw new Error(MessageEnum.INVALID_STEP_TYPE);

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
    if (!step.comparison) throw new Error(MessageEnum.INVALID_STEP_TYPE);

    this.checkValidComparison(step.comparison, processEntity);
  }

  checkSteps(processEntity: ProcessEntity): void {
    this.cehckStepNames(processEntity.steps);

    processEntity.steps.map((x) => {
      if (x.type === ProcessStepTypeEnum.GRPC) {
        this.checkValidGrpcSteps(x, processEntity);
      } else if (x.type === ProcessStepTypeEnum.API) {
        this.checkValidApiSteps(x, processEntity);
      } else if (x.type === ProcessStepTypeEnum.COMPARISON) {
        this.checkValidComparisonSteps(x, processEntity);
      }
    });
  }

  checkDefaultFailStep(processEntity: ProcessEntity): void {
    if (
      processEntity.defaultFailStep &&
      !processEntity.steps.find((x) => x.name === processEntity.defaultFailStep)
    ) {
      throw new Error(MessageEnum.INVALID_STEP_TYPE);
    }
  }

  async execute({
    processData,
    processEntity,
    steps,
    validationData,
    defaultFailStep,
  }: UpdateProcessStepsCommand) {
    // Update the process steps
    processEntity.steps = steps;
    processEntity.data = processData;
    processEntity.validationData = validationData;
    processEntity.defaultFailStep = defaultFailStep;

    // Check if the default fail step exists
    if (defaultFailStep) {
      this.checkDefaultFailStep(processEntity);
    }

    // Check if the steps are valid
    this.checkSteps(processEntity);

    // Save the updated process entity
    await this.processRepository.updateOneById(processEntity);

    // Return the updated process entity
    return processEntity;
  }
}
