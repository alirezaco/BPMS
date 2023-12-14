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
import { BadRequestException } from '@nestjs/common';

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
      throw new BadRequestException(MessageEnum.DUPLICATE_STEP_NAME);
    }
  }

  checkFailStep(steps: StepEntity[], failStep?: string) {
    if (failStep && !steps.find((x) => x.name === failStep)) {
      throw new BadRequestException(MessageEnum.INVALID_STEP_TYPE);
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

      this.checkFailStep(processEntity.steps, x.failStep);
    });
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
    processData,
    processEntity,
    steps,
    validationData,
    defaultFailStep,
    UISchema,
  }: UpdateProcessStepsCommand) {
    // Update the process steps
    processEntity.steps = steps;
    processEntity.data = processData;
    processEntity.validationData = validationData;
    processEntity.defaultFailStep = defaultFailStep;
    processEntity.UISchema = UISchema;

    // Check if the default fail step exists
    this.checkFailStep(processEntity.steps, processEntity.defaultFailStep);

    // Check if the steps are valid
    this.checkSteps(processEntity);

    // Set the final step
    processEntity = this.setFinalSteps(processEntity);

    // Save the updated process entity
    await this.processRepository.updateOneById(processEntity);

    // Return the updated process entity
    return processEntity;
  }
}
