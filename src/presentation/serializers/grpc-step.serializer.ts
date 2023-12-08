import { GrpcStepEntity } from 'domain/models';
import { DataParamSerializer } from './data-param.serializer';

export class GrpcStepSerializer {
  service: string;
  package: string;
  method: string;
  protofile: string;
  url: string;
  metadata: DataParamSerializer[];
  payload: DataParamSerializer[];

  constructor(initial: GrpcStepEntity) {
    this.service = initial?.service;
    this.package = initial?.package;
    this.method = initial?.method;
    this.protofile = initial?.protofile;
    this.url = initial?.url;
    this.metadata = initial?.metadata?.map(
      (metadata) => new DataParamSerializer(metadata),
    );
    this.payload = initial?.payload?.map(
      (payload) => new DataParamSerializer(payload),
    );
  }
}
