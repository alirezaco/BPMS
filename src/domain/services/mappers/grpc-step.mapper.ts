import { BaseMapper } from './base.mapper';
import { GrpcStepEntity, GrpcStepSchema } from 'domain/models';
import { Injectable } from '@nestjs/common';
import { GrpcStepRequest } from 'infrastructure/interfaces';
import { DataParamMapper } from './data-param.mapper';

@Injectable()
export class GrpcStepMapper
  implements BaseMapper<GrpcStepSchema, GrpcStepEntity>
{
  constructor(private readonly DataParamMapper: DataParamMapper) {}

  convertEntityToSchema(entity: GrpcStepEntity): GrpcStepSchema {
    return {
      method: entity?.method,
      url: entity?.url,
      protofile: entity?.protofile,
      service: entity?.service,
      metadata: entity?.metadata.map((metadata) =>
        this.DataParamMapper.convertEntityToSchema(metadata),
      ),
      payload: entity?.payload.map((payload) =>
        this.DataParamMapper.convertEntityToSchema(payload),
      ),
      package: entity?.package,
    };
  }

  convertSchemaToEntity(schema: GrpcStepSchema): GrpcStepEntity {
    if (!schema) return;

    return new GrpcStepEntity({
      method: schema?.method,
      url: schema?.url,
      protofile: schema?.protofile,
      service: schema?.service,
      metadata: schema?.metadata.map((metadata) =>
        this.DataParamMapper.convertSchemaToEntity(metadata),
      ),
      payload: schema?.payload.map((payload) =>
        this.DataParamMapper.convertSchemaToEntity(payload),
      ),
      package: schema?.package,
    });
  }

  convertRequestToEntity(request: Partial<GrpcStepRequest>): GrpcStepEntity {
    return new GrpcStepEntity({
      method: request?.method,
      url: request?.url,
      protofile: request?.protofile,
      service: request?.service,
      metadata: request.metadata
        ? request?.metadata.map((metadata) =>
            this.DataParamMapper.convertRequestToEntity(metadata),
          )
        : [],
      payload: request?.payload
        ? request?.payload.map((payload) =>
            this.DataParamMapper.convertRequestToEntity(payload),
          )
        : [],
      package: request?.package,
    });
  }
}
