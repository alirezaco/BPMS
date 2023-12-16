import { ComparisonStepEntity, ComparisonStepSchema } from 'domain/models';
import { DataParamMapper } from './data-param.mapper';
import { BaseMapper } from './base.mapper';
import { ComparisonStepRequest } from 'infrastructure/interfaces';
import { convertToComparisonFunc } from 'infrastructure/utils';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ComparisonStepMapper
  implements BaseMapper<ComparisonStepSchema, ComparisonStepEntity>
{
  constructor(private readonly dataParamMapper: DataParamMapper) {}

  convertEntityToSchema(entity: ComparisonStepEntity): ComparisonStepSchema {
    return {
      func: entity?.func,
      left:
        entity?.left &&
        this.dataParamMapper.convertEntityToSchema(entity?.left),
      right:
        entity?.right &&
        this.dataParamMapper.convertEntityToSchema(entity?.right),
      children:
        entity?.children?.map((child) => this.convertEntityToSchema(child)) ||
        [],
    };
  }

  convertSchemaToEntity(schema: ComparisonStepSchema): ComparisonStepEntity {
    if (!schema) return;

    return new ComparisonStepEntity({
      func: schema?.func,
      left:
        schema?.left &&
        this.dataParamMapper.convertSchemaToEntity(schema?.left),
      right:
        schema?.right &&
        this.dataParamMapper.convertSchemaToEntity(schema?.right),
      children:
        schema?.children?.map((child) => this.convertSchemaToEntity(child)) ||
        [],
    });
  }

  convertRequestToEntity(request: ComparisonStepRequest): ComparisonStepEntity {
    return new ComparisonStepEntity({
      func: convertToComparisonFunc(request?.func),
      left:
        request?.left &&
        this.dataParamMapper.convertRequestToEntity(request?.left),
      right:
        request?.right &&
        this.dataParamMapper.convertRequestToEntity(request?.right),
      children:
        request?.children?.map((child) => this.convertRequestToEntity(child)) ||
        [],
    });
  }
}
