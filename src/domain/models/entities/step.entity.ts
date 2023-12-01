import { ComparisonStepEntity } from './comparison-step.entity';
import { GrpcStepEntity } from './grpc-step.entity';
import { ApiStepEntity } from './api-step.entity';
import { ProcessStepTypeEnum } from 'infrastructure/enum';

export class StepEntity {
  public id: string;
  public name: string;
  public type: ProcessStepTypeEnum;
  public comparison?: ComparisonStepEntity;
  public grpc?: GrpcStepEntity;
  public api?: ApiStepEntity;
  public isSync: boolean;
  public isFinal: boolean;
  public failStep?: string;

  constructor(initial: Partial<StepEntity>) {
    this.id = initial?.id;
    this.name = initial?.name;
    this.type = initial?.type;
    this.comparison = initial?.comparison;
    this.grpc = initial?.grpc;
    this.api = initial?.api;
    this.isFinal = initial?.isFinal || false;
    this.isSync = initial?.isSync || false;
    this.failStep = initial?.failStep;
  }
}
