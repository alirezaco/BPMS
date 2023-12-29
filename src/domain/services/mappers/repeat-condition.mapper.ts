import { RepeatConditionEntity, RepeatConditionSchema } from 'domain/models';
import { BaseMapper } from './base.mapper';
import { RepeatCondition } from 'infrastructure/interfaces';
import { Injectable } from '@nestjs/common';
import { DataParamMapper } from './data-param.mapper';
import { convertToComparisonFunc } from 'infrastructure/utils';

@Injectable()
export class RepeatConditionMapper
  implements
    BaseMapper<RepeatConditionSchema, RepeatConditionEntity, RepeatCondition>
{
  constructor(private readonly dataParamMapper: DataParamMapper) {}

  convertSchemaToEntity(schema: RepeatConditionSchema): RepeatConditionEntity {
    if (!schema) return;

    return new RepeatConditionEntity({
      func: schema?.func,
      variable:
        schema?.variable &&
        this.dataParamMapper.convertSchemaToEntity(schema?.variable),
    });
  }

  convertEntityToSchema(entity: RepeatConditionEntity): RepeatConditionSchema {
    return {
      func: entity?.func,
      variable:
        entity?.variable &&
        this.dataParamMapper.convertEntityToSchema(entity?.variable),
    };
  }

  convertRequestToEntity(
    request: Partial<RepeatCondition>,
  ): RepeatConditionEntity {
    return new RepeatConditionEntity({
      func: convertToComparisonFunc(request?.func),
      variable:
        request?.variable &&
        this.dataParamMapper.convertRequestToEntity(request?.variable),
    });
  }
}
