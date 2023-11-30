import { ProcessEntity, StepEntity } from 'domain/models';

export class UpdateProcessStepsCommand {
  constructor(
    public processEntity: ProcessEntity,
    public steps: StepEntity[],
    public validationData: Record<string, any>,
    public processData: Record<string, any>,
    public defaultFailStep?: string,
  ) {}
}
