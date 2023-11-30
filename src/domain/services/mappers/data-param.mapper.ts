import { DataParamEntity, DataParamSchema } from 'domain/models';
import { BaseMapper } from './base.mapper';
import { Injectable } from '@nestjs/common';
import { DataParam } from 'infrastructure/interfaces';

@Injectable()
export class DataParamMapper
  implements BaseMapper<DataParamSchema, DataParamEntity>
{
  convertEntityToSchema(entity: DataParamEntity): DataParamSchema {
    const schema = new DataParamSchema();

    schema.source = entity.source;
    schema.key = entity.key;
    schema.source_key = entity.sourceKey;

    return schema;
  }

  convertSchemaToEntity(schema: DataParamSchema): DataParamEntity {
    return new DataParamEntity({
      source: schema.source,
      key: schema.key,
      sourceKey: schema.source_key,
    });
  }

  convertRequestToEntity(request: Partial<DataParam>): DataParamEntity {
    return new DataParamEntity({
      source: request.source,
      key: request.key,
      sourceKey: request.source_key,
    });
  }
}
