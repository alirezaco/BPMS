import { Model } from 'mongoose';
import { BaseRepository } from './base.repository';
import { AutoPayEntity, AutoPaySchema } from 'domain/models';
import { AutoPayMapper } from '../mappers';
import { InjectModel } from '@nestjs/mongoose';

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
}
