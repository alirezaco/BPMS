import { Injectable } from '@nestjs/common';
import { BaseMapper } from './base.mapper';
import { UISchemaEntity, UISchemaSchema } from 'domain/models';
import { UISchema } from 'infrastructure/interfaces';

@Injectable()
export class UISchemaMapper
  implements BaseMapper<UISchemaSchema, UISchemaEntity>
{
  convertEntityToSchema(entity: UISchemaEntity): UISchemaSchema {
    const schema = new UISchemaSchema();

    schema.key = entity.key;
    schema.title = entity.title;
    schema.type = entity.type;
    schema.hint = entity.hint;
    schema.min = entity.min;
    schema.max = entity.max;
    schema.regex = entity.regex;
    schema.error_text = entity.errorText;
    schema.is_required = entity.isRequired;
    schema.is_money = entity.isMoney;
    schema.is_english = entity.isEnglish;
    schema.weight = entity.weight;
    schema.true_text = entity.trueText;
    schema.false_text = entity.falseText;

    return schema;
  }

  convertSchemaToEntity(schema: UISchemaSchema): UISchemaEntity {
    if (!schema) return;

    return new UISchemaEntity({
      key: schema.key,
      title: schema.title,
      type: schema.type,
      hint: schema.hint,
      min: schema.min,
      max: schema.max,
      regex: schema.regex,
      errorText: schema.error_text,
      isRequired: schema.is_required,
      isMoney: schema.is_money,
      isEnglish: schema.is_english,
      weight: schema.weight,
      trueText: schema.true_text,
      falseText: schema.false_text,
    });
  }

  convertRequestToEntity(request: Partial<UISchema>): UISchemaEntity {
    return new UISchemaEntity({
      key: request?.key,
      title: request?.title,
      type: request?.type,
      hint: request?.hint,
      min: request?.min,
      max: request?.max,
      regex: request?.regex,
      errorText: request?.error_text,
      isRequired: request?.is_required,
      isMoney: request?.is_money,
      isEnglish: request?.is_english,
      weight: request?.weight,
      trueText: request?.true_text,
      falseText: request?.false_text,
    });
  }
}
