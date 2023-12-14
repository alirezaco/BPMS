import { FileEntity, FileSchema } from 'domain/models';
import { Types } from 'mongoose';

export class FileMapper {
  constructor() {}

  convertEntityToSchema(entity: FileEntity): FileSchema {
    const schema = new FileSchema();

    schema._id = entity?.id ? new Types.ObjectId(entity?.id) : undefined;
    schema.created_at = entity?.createdAt;
    schema.updated_at = entity?.updatedAt;
    schema.deleted_at = entity?.deletedAt;
    schema.restored_at = entity?.restoreAt;
    schema.owner = new Types.ObjectId(entity?.owner);
    schema.tags = entity?.tags;
    schema.name = entity?.name;
    schema.value = entity?.value;

    return schema;
  }

  convertSchemaToEntity(schema: FileSchema): FileEntity {
    if (!schema) return;

    return new FileEntity({
      id: schema?._id?.toString(),
      createdAt: schema?.created_at,
      updatedAt: schema?.updated_at,
      deletedAt: schema?.deleted_at,
      restoreAt: schema?.restored_at,
      owner: schema?.owner?.toString(),
      tags: schema?.tags,
      name: schema?.name,
      value: schema?.value,
    });
  }

  convertRequestToEntity(
    request: Partial<FileSchema>,
    owner?: string,
  ): FileEntity {
    return new FileEntity({
      owner,
      name: request?.name,
      value: request?.value,
    });
  }
}
