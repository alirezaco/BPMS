import { AutoPayActivityEntity, AutoPayActivitySchema } from 'domain/models';
import { BaseRepository } from './base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { AutoPayActivityMapper } from '../mappers';
import { findAndCountAll } from 'infrastructure/database';
import { ListAutopayActivityRequest } from 'infrastructure/interfaces';

export class AutoPayActivityRepository extends BaseRepository<
  AutoPayActivitySchema,
  AutoPayActivityEntity
> {
  constructor(
    @InjectModel(AutoPayActivitySchema.name)
    private readonly autopayActivityModel: Model<AutoPayActivitySchema>,
    private readonly autopayActivityMapper: AutoPayActivityMapper,
  ) {
    super(autopayActivityModel, autopayActivityMapper);
  }

  async findAllAdmin(
    request: ListAutopayActivityRequest,
  ): Promise<findAndCountAll<AutoPayActivityEntity>> {
    const where: FilterQuery<AutoPayActivitySchema> = { deleted_at: null };

    if (request?.process_id) {
      where['process_id'] = new Types.ObjectId(request.process_id);
    }

    if (request?.autopay_id) {
      where['autopay_id'] = new Types.ObjectId(request.autopay_id);
    }

    if (request?.status) {
      where['status'] = request.status;
    }

    if (request?.has_payment !== undefined) {
      where['has_payment'] = request.has_payment;
    }

    if (request.start_date && request.end_date) {
      where['created_at'] = {
        $gte: new Date(request.start_date),
        $lte: new Date(request.end_date),
      };
    }

    return super.findAll({
      skip: request.skip,
      limit: request.limit,
      where,
      populate: [
        {
          path: 'autopay',
          select: 'name user_id id',
        },
        {
          path: 'process',
          select: 'name id service_name',
        },
      ],
    });
  }
}
