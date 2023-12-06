import { ProcessEntity, StepEntity, UISchemaEntity } from 'domain/models';

export class UpdateProcessStepsCommand {
  constructor(
    public processEntity: ProcessEntity,
    public steps: StepEntity[],
    public validationData: Record<string, any>,
    public processData: Record<string, any>,
    public UISchema: UISchemaEntity[],
    public defaultFailStep?: string,
  ) {}
}
