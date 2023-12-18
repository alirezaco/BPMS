import { FilterQuery, Model, Types } from 'mongoose';
import { BaseRepository } from './base.repository';
import { AutoPayEntity, AutoPaySchema } from 'domain/models';
import { AutoPayMapper } from '../mappers';
import { InjectModel } from '@nestjs/mongoose';
import { findAndCountAll } from 'infrastructure/database';
import {
  ListAutopayAdminRequest,
  ListAutopayRequest,
} from 'infrastructure/interfaces';
import { CronRegexUtil } from 'infrastructure/utils';
import { PeriodEnum, ProcessingStatusEnum } from 'infrastructure/enum';

export class AutoPayRepository extends BaseRepository<
  AutoPaySchema,
  AutoPayEntity
> {
  constructor(
    @InjectModel(AutoPaySchema.name)
    private readonly autopayModel: Model<AutoPaySchema>,
    private readonly autopayMapper: AutoPayMapper,
  ) {
    super(autopayModel, autopayMapper);
  }

  async findOneByName(name: string): Promise<AutoPayEntity> {
    const result = await this.autopayModel.findOne({ name });

    return this.autopayMapper.convertSchemaToEntity(result);
  }

  async deleteManyByProcessId(processId: string): Promise<void> {
    await this.autopayModel.deleteMany({
      process_id: new Types.ObjectId(processId),
    });
  }

  async findByUserId(
    listAutopayRequest: ListAutopayRequest,
    userId: string,
  ): Promise<findAndCountAll<AutoPayEntity>> {
    const autopays = await this.findAll({
      where: {
        user_id: new Types.ObjectId(userId),
        deleted_at: null,
        process_id: new Types.ObjectId(listAutopayRequest.process_id),
      },
      limit: listAutopayRequest.limit,
      skip: listAutopayRequest.skip,
    });

    return autopays;
  }

  async findAllAdmin(
    request: ListAutopayAdminRequest,
  ): Promise<findAndCountAll<AutoPayEntity>> {
    const where: FilterQuery<AutoPaySchema> = { deleted_at: null };

    if (request?.user_id) {
      where['user_id'] = new Types.ObjectId(request.user_id);
    }

    if (request?.process_id) {
      where['process_id'] = new Types.ObjectId(request.process_id);
    }

    if (request?.name) {
      where['name'] = {
        $regex: request.name,
      };
    }

    if (request?.is_active !== undefined) {
      where['is_active'] = request.is_active;
    }

    if (request?.status) {
      where['processing_status'] = request.status;
    }

    if (request?.allowed_direct_debit !== undefined) {
      where['allowed_direct_debit'] = request.allowed_direct_debit;
    }

    if (request?.period) {
      where['period'] = request.period;
    }

    return this.findAll({
      where,
      limit: request.limit,
      skip: request.skip,
    });
  }

  async getHourlyQueue(): Promise<AutoPayEntity[]> {
    const autopays = await this.findAll({
      where: {
        deleted_at: null,
        processing_status: { $ne: ProcessingStatusEnum.IN_PROGRESS },
        $and: [
          {
            $or: [
              { period: PeriodEnum.HOUR },
              {
                period: PeriodEnum.CRON,
                cron: { $regex: CronRegexUtil.hourlyRegex() },
              },
            ],
          },
          {
            $or: [
              {
                last_run_at: {
                  $lt: new Date(new Date().getTime() - 60 * 60 * 1000),
                },
              },
              {
                last_run_at: null,
              },
            ],
          },
        ],
      },
      order: [['last_run_at', 'asc']],
      include: { _id: 1 },
    });

    return autopays.rows;
  }

  async getDailyQueue(): Promise<AutoPayEntity[]> {
    const autopays = await this.findAll({
      where: {
        deleted_at: null,
        processing_status: { $ne: ProcessingStatusEnum.IN_PROGRESS },
        $and: [
          {
            $or: [
              { period: PeriodEnum.DAY },
              {
                period: PeriodEnum.CRON,
                cron: { $regex: CronRegexUtil.dailyRegex() },
              },
            ],
          },
          {
            $or: [
              {
                last_run_at: {
                  $lt: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
                },
              },
              {
                last_run_at: null,
              },
            ],
          },
        ],
      },
      order: [['last_run_at', 'asc']],
      include: { _id: 1 },
    });

    return autopays.rows;
  }

  async getWeeklyQueue(): Promise<AutoPayEntity[]> {
    const autopays = await this.findAll({
      where: {
        deleted_at: null,
        processing_status: { $ne: ProcessingStatusEnum.IN_PROGRESS },
        period: PeriodEnum.WEEK,
        $or: [
          {
            last_run_at: {
              $lt: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
            },
          },
          {
            last_run_at: null,
          },
        ],
      },
      order: [['last_run_at', 'asc']],
      include: { _id: 1 },
    });

    return autopays.rows;
  }

  async getMonthlyQueue(): Promise<AutoPayEntity[]> {
    const autopays = await this.findAll({
      where: {
        deleted_at: null,
        processing_status: { $ne: ProcessingStatusEnum.IN_PROGRESS },
        $and: [
          {
            $or: [
              { period: PeriodEnum.MONTH },
              {
                period: PeriodEnum.CRON,
                cron: { $regex: CronRegexUtil.monthlyRegex() },
              },
            ],
          },
          {
            $or: [
              {
                last_run_at: {
                  $lt: new Date(
                    new Date().getTime() - 30 * 24 * 60 * 60 * 1000,
                  ),
                },
              },
              {
                last_run_at: null,
              },
            ],
          },
        ],
      },
      order: [['last_run_at', 'asc']],
      include: { _id: 1 },
    });

    return autopays.rows;
  }

  async getYearlyQueue(): Promise<AutoPayEntity[]> {
    const autopays = await this.findAll({
      where: {
        deleted_at: null,
        processing_status: { $ne: ProcessingStatusEnum.IN_PROGRESS },
        period: PeriodEnum.YEAR,
        $or: [
          {
            last_run_at: {
              $lt: new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000),
            },
          },
          {
            last_run_at: null,
          },
        ],
      },
      order: [['last_run_at', 'asc']],
      include: { _id: 1 },
    });

    return autopays.rows;
  }

  async updateActiveByProcessId(processId: string, isActive: boolean) {
    await this.autopayModel.updateOne(
      {
        process_id: new Types.ObjectId(processId),
      },
      {
        is_active: isActive,
      },
    );
  }
}
