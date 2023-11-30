import { DataParamEntity } from './data-param.entity';

export class GrpcStepEntity {
  public service: string;
  public method: string;
  public protofile: string;
  public url: string;
  public metadata: DataParamEntity[];
  public payload: DataParamEntity[];

  constructor(initial: Partial<GrpcStepEntity>) {
    this.service = initial?.service;
    this.method = initial?.method;
    this.protofile = initial?.protofile;
    this.url = initial?.url;
    this.metadata = initial?.metadata || [];
    this.payload = initial?.payload || [];
  }
}
