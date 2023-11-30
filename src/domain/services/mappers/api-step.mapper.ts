import { BaseMapper } from './base.mapper';
import { ApiStepEntity, ApiStepSchema } from 'domain/models';
import { Injectable } from '@nestjs/common';
import { ApiStepRequest } from 'infrastructure/interfaces';
import { DataParamMapper } from './data-param.mapper';

@Injectable()
export class ApiStepMapper implements BaseMapper<ApiStepSchema, ApiStepEntity> {
  constructor(private readonly DataParamMapper: DataParamMapper) {}

  convertEntityToSchema(entity: ApiStepEntity): ApiStepSchema {
    return {
      method: entity?.method,
      url: entity?.url,
      headers: entity?.headers.map((header) =>
        this.DataParamMapper.convertEntityToSchema(header),
      ),
      params: entity?.params.map((param) =>
        this.DataParamMapper.convertEntityToSchema(param),
      ),
      body: entity?.body.map((body) =>
        this.DataParamMapper.convertEntityToSchema(body),
      ),
      query: entity?.query.map((query) =>
        this.DataParamMapper.convertEntityToSchema(query),
      ),
    };
  }

  convertSchemaToEntity(schema: ApiStepSchema): ApiStepEntity {
    if (!schema) return;

    return new ApiStepEntity({
      method: schema?.method,
      url: schema?.url,
      headers: schema?.headers.map((header) =>
        this.DataParamMapper.convertSchemaToEntity(header),
      ),
      params: schema?.params.map((param) =>
        this.DataParamMapper.convertSchemaToEntity(param),
      ),
      body: schema?.body.map((body) =>
        this.DataParamMapper.convertSchemaToEntity(body),
      ),
      query: schema?.query.map((query) =>
        this.DataParamMapper.convertSchemaToEntity(query),
      ),
    });
  }

  convertRequestToEntity(request: Partial<ApiStepRequest>): ApiStepEntity {
    return new ApiStepEntity({
      method: request?.method,
      url: request?.url,
      headers: request.headers
        ? request?.headers.map((header) =>
            this.DataParamMapper.convertRequestToEntity(header),
          )
        : [],
      params: request.params
        ? request?.params.map((param) =>
            this.DataParamMapper.convertRequestToEntity(param),
          )
        : [],
      body: request?.bodies
        ? request?.bodies.map((body) =>
            this.DataParamMapper.convertRequestToEntity(body),
          )
        : [],
      query: request?.queries
        ? request?.queries.map((query) =>
            this.DataParamMapper.convertRequestToEntity(query),
          )
        : [],
    });
  }
}
