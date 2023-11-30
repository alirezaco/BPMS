import { StepEntity } from 'domain/models';
import { ComparisonStepSerializer } from './comparison-step.serializer';
import { GrpcStepSerializer } from './grpc-step.serializer';
import { ApiStepSerializer } from './api-step.serializer';

export class StepSerializer {
  name: string;
  type: string;
  comparison?: ComparisonStepSerializer | undefined;
  grpc?: GrpcStepSerializer | undefined;
  api?: ApiStepSerializer | undefined;

  constructor(initial: StepEntity) {
    this.name = initial?.name;
    this.type = initial?.type;
    this.comparison = initial?.comparison
      ? new ComparisonStepSerializer(initial?.comparison)
      : undefined;
    this.grpc = initial?.grpc
      ? new GrpcStepSerializer(initial?.grpc)
      : undefined;
    this.api = initial?.api ? new ApiStepSerializer(initial?.api) : undefined;
  }
}
