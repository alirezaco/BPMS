import { RepeatEntity, RepeatSchema } from 'domain/models';
import { BaseMapper } from './base.mapper';
import { Repeat } from 'infrastructure/interfaces';
import { Injectable } from '@nestjs/common';
import { RepeatConditionMapper } from './repeat-condition.mapper';
import { CounterMapper } from './counter.mapper';

@Injectable()
export class RepeatMapper
  implements BaseMapper<RepeatSchema, RepeatEntity, Repeat>
{
  constructor(
    private readonly repeatConditionMapper: RepeatConditionMapper,
    private readonly counterMapper: CounterMapper,
  ) {}

  convertSchemaToEntity(schema: RepeatSchema): RepeatEntity {
    if (!schema) return;

    return new RepeatEntity({
      condition: this.repeatConditionMapper.convertSchemaToEntity(
        schema?.condition,
      ),
      counter: this.counterMapper.convertSchemaToEntity(schema?.counter),
      startStep: schema?.start_step,
      endStep: schema?.end_step,
    });
  }

  convertEntityToSchema(entity: RepeatEntity): RepeatSchema {
    return {
      condition: this.repeatConditionMapper.convertEntityToSchema(
        entity?.condition,
      ),
      counter: this.counterMapper.convertEntityToSchema(entity?.counter),
      start_step: entity?.startStep,
      end_step: entity?.endStep,
    };
  }

  convertRequestToEntity(request: Partial<Repeat>): RepeatEntity {
    return new RepeatEntity({
      condition: request?.repeat_condition
        ? this.repeatConditionMapper.convertRequestToEntity(
            request?.repeat_condition,
          )
        : null,
      counter: request?.counter
        ? this.counterMapper.convertRequestToEntity(request?.counter)
        : null,
      startStep: request?.start_step,
      endStep: request?.end_step,
    });
  }
}
