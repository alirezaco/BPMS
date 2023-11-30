import { Model } from 'mongoose';
import { ProcessSchema, ProcessEntity } from 'domain/models';
import { BaseRepository } from './base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { ProcessMapper } from '../mappers';

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
}
