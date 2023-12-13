import { StepEntity } from 'domain/models';
import { ComparisonStepSerializer } from './comparison-step.serializer';
import { GrpcStepSerializer } from './grpc-step.serializer';
import { ApiStepSerializer } from './api-step.serializer';
import { DataParamSerializer } from './data-param.serializer';

export class StepSerializer {
  name: string;
  type: string;
  comparison?: ComparisonStepSerializer | undefined;
  grpc?: GrpcStepSerializer | undefined;
  api?: ApiStepSerializer | undefined;
  is_sync: boolean;
  is_final: boolean;
  fail_step: string;
  is_payment?: boolean;
  payment_param?: DataParamSerializer;

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
    this.is_sync = initial?.isSync;
    this.is_final = initial?.isFinal;
    this.fail_step = initial?.failStep;
    this.is_payment = initial?.isPayment;
    this.payment_param = initial?.paymentParam
      ? new DataParamSerializer(initial?.paymentParam)
      : undefined;
  }
}
