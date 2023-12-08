import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { Injectable } from '@nestjs/common';
import { GrpcStepEntity } from 'domain/models';

@Injectable()
export class GrpcProxy {
  createService(protoPath: string, packageName: string): Record<string, any> {
    const packageDefinition = protoLoader.loadSync(protoPath, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    const proto = grpc.loadPackageDefinition(packageDefinition);
    return proto[packageName];
  }

  createClient(
    url: string,
    serviceName: string,
    serviceContructor: Record<string, any>,
  ): Record<string, any> {
    const client = serviceContructor[serviceName](
      url,
      grpc.credentials.createInsecure(),
    );

    return client;
  }

  async uploadProtoFile(file: string): Promise<string> {
    //todo upload proto file

    return '';
  }

  async request(
    grpcStep: GrpcStepEntity,
    payload: any,
    metadata: Record<string, any>,
  ): Promise<any> {
    const protoPath = await this.uploadProtoFile(grpcStep.protofile);

    const client = this.createClient(
      grpcStep.url,
      grpcStep.service,
      this.createService(protoPath, grpcStep.package),
    );

    let meta: grpc.Metadata;
    if (metadata) {
      meta = new grpc.Metadata();
      Object.entries(metadata).forEach(([key, value]) => {
        meta.add(key, value);
      });
    }

    const response = await client[grpcStep.method](payload, meta);

    return response;
  }
}
