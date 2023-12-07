import { FilterQuery, Model } from 'mongoose';
import { ProcessSchema, ProcessEntity } from 'domain/models';
import { BaseRepository } from './base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { ProcessMapper } from '../mappers';
import { ListProcessesAdminRequest } from 'infrastructure/interfaces';
import { findAndCountAll } from 'infrastructure/database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProcessRepository extends BaseRepository<
  ProcessSchema,
  ProcessEntity
> {
  constructor(
    protected readonly proceccMapper: ProcessMapper,
    @InjectModel(ProcessSchema.name)
    private readonly processModel: Model<ProcessSchema>,
  ) {
    super(processModel, proceccMapper);
  }

  async findOneByName(name: string): Promise<ProcessEntity> {
    const result = await this.processModel.findOne({ name });

    return this.proceccMapper.convertSchemaToEntity(result);
  }

  async findAllAdmin(
    request: ListProcessesAdminRequest,
  ): Promise<findAndCountAll<ProcessEntity>> {
    const where: FilterQuery<ProcessSchema> = { deleted_at: null };

    if (request?.name) {
      where['name'] = { $regex: request.name, $options: 'i' };
    }

    if (request?.roles) {
      where['roles'] = { $in: request.roles };
    }

    if (request?.is_active) {
      where['is_active'] = request.is_active;
    }

    if (request?.allowed_direct_debit) {
      where['allowed_direct_debit'] = request.allowed_direct_debit;
    }

    return super.findAll({
      skip: request.skip,
      limit: request.limit,
      where,
    });
  }
}
