import { Injectable } from '@nestjs/common';
import { BaseMapper } from './base.mapper';
import { CounterEntity, CounterSchema } from 'domain/models';
import { Counter } from 'infrastructure/interfaces';
import { DataParamMapper } from './data-param.mapper';

@Injectable()
export class CounterMapper
  implements BaseMapper<CounterSchema, CounterEntity, Counter>
{
  constructor(private readonly dataParamMapper: DataParamMapper) {}

  convertEntityToSchema(entity: CounterEntity): CounterSchema {
    const schema = new CounterSchema();

    schema.key = entity.key;
    schema.initial = entity.initial
      ? this.dataParamMapper.convertEntityToSchema(entity.initial)
      : null;
    schema.step = entity.step;
    schema.step_var = entity.stepVar
      ? this.dataParamMapper.convertEntityToSchema(entity.stepVar)
      : null;

    return schema;
  }

  convertSchemaToEntity(schema: CounterSchema): CounterEntity {
    if (!schema) return;

    return new CounterEntity({
      key: schema?.key,
      initial: schema?.initial
        ? this.dataParamMapper.convertSchemaToEntity(schema?.initial)
        : null,
      step: schema?.step,
      stepVar: schema?.step_var
        ? this.dataParamMapper.convertSchemaToEntity(schema?.step_var)
        : null,
    });
  }

  convertRequestToEntity(request: Partial<Counter>): CounterEntity {
    return new CounterEntity({
      key: request?.key,
      initial: request?.initial
        ? this.dataParamMapper.convertRequestToEntity(request?.initial)
        : null,
      step: request?.step,
      stepVar: request?.step_var
        ? this.dataParamMapper.convertRequestToEntity(request?.step_var)
        : null,
    });
  }
}
