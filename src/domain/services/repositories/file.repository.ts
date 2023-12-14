import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { BaseRepository } from './base.repository';
import { FileEntity, FileSchema } from 'domain/models';
import { FileMapper } from '../mappers';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class FileRepository extends BaseRepository<FileSchema, FileEntity> {
  constructor(
    @InjectModel(FileSchema.name)
    private readonly fileModel: Model<FileSchema>,
    private readonly fileMapper: FileMapper,
  ) {
    super(fileModel, fileMapper);
  }
}
