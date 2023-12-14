import { BaseEntity, BaseSchema } from 'domain/models';
import { BaseMapper } from '../mappers';
import { FilterQuery, Model, Types } from 'mongoose';
import { FilterType, findAndCountAll } from 'infrastructure/database';
import { OrderEnum } from 'infrastructure/enum';

export abstract class BaseRepository<
  ModelType extends BaseSchema,
  EntityType extends BaseEntity,
> {
  constructor(
    private readonly model: Model<ModelType>,
    private readonly mapper: BaseMapper<ModelType, EntityType>,
  ) {}

  async count(where: FilterQuery<ModelType>): Promise<number> {
    return this.model.countDocuments(where);
  }

  async checkExistById(id: string, fetchDeleted = false): Promise<boolean> {
    const result = await this.model.findOne({ _id: id }, { _id: 1 });

    if (result && !fetchDeleted && result.deleted_at) return false;

    return !!result;
  }

  async findOne(
    where: FilterQuery<ModelType>,
    fetchDeleted = false,
  ): Promise<EntityType> {
    const result = await this.model.findOne(where);

    if (result && !fetchDeleted && result.deleted_at) return null;

    return this.mapper.convertSchemaToEntity(result as ModelType);
  }

  async findOneById(id: string, fetchDeleted = false): Promise<EntityType> {
    const result = await this.model.findById(id);

    if (result && !fetchDeleted && result.deleted_at) return null;

    return this.mapper.convertSchemaToEntity(result as ModelType);
  }

  async findAll(
    filter: FilterType<ModelType>,
    fetchDeleted = false,
  ): Promise<findAndCountAll<EntityType>> {
    if (!filter.where) filter.where = {};

    if (!fetchDeleted) filter.where['deleted_at'] = { $eq: null };

    if (!filter.order) filter.order = [];

    filter.order.push(['_id', OrderEnum.DESC]);

    const result = await this.model
      .find(filter.where, filter.include)
      .sort(filter.order)
      .skip(filter.skip)
      .limit(filter.limit);
    const count = await this.model.countDocuments(filter.where);

    return {
      rows: result.map((x) =>
        this.mapper.convertSchemaToEntity(x as ModelType),
      ),
      count: count,
    };
  }

  async updateOne(
    entity: Partial<EntityType>,
    where: FilterQuery<ModelType>,
  ): Promise<EntityType> {
    const model = this.mapper.convertEntityToSchema(entity as EntityType);

    delete model._id;

    const data = await this.model.findOneAndUpdate(
      where,
      { ...model, updated_at: new Date() },
      { new: true },
    );

    return this.mapper.convertSchemaToEntity(data);
  }

  async updateOneById(entity: Partial<EntityType>) {
    return this.updateOne(entity, { _id: new Types.ObjectId(entity.id) });
  }

  async deleteOne(id: string): Promise<EntityType> {
    const data = await this.model.findOneAndUpdate(
      {
        deleted_at: { $eq: null },
        _id: new Types.ObjectId(id),
      },
      { deleted_at: new Date() },
      { new: true },
    );

    return this.mapper.convertSchemaToEntity(data);
  }

  async restoreOne(id: string): Promise<EntityType> {
    const data = await this.model.findOneAndUpdate(
      {
        deleted_at: { $ne: null },
        _id: new Types.ObjectId(id),
      },
      { $unset: { deleted_at: 1 }, restore_at: new Date() },
      { new: true },
    );

    return this.mapper.convertSchemaToEntity(data);
  }

  async destroyeOne(id: string): Promise<EntityType> {
    const data = await this.model.findOneAndDelete({
      _id: new Types.ObjectId(id),
    });

    return this.mapper.convertSchemaToEntity(data as any);
  }
}
