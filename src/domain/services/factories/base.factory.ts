import { BaseEntity, BaseSchema } from 'domain/models';
import { BaseMapper } from '../mappers';
import { Model } from 'mongoose';

export abstract class BaseFactory<
  SchemeType extends BaseSchema,
  EntityType extends BaseEntity,
> {
  constructor(
    protected readonly mapper: BaseMapper<SchemeType, EntityType>,
    protected readonly model: Model<SchemeType>,
  ) {}

  async create(entity: EntityType): Promise<EntityType> {
    const schema = this.mapper.convertEntityToSchema(entity);

    const res = await this.model.create(schema);

    return this.mapper.convertSchemaToEntity(res as SchemeType);
  }
}
