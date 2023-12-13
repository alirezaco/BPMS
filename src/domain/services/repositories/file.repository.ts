import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { BaseRepository } from './base.repository';
import { FileEntity, FileSchema } from 'domain/models';
import { FileMapper } from '../mappers';

@Injectable()
export class FileRepository extends BaseRepository<FileSchema, FileEntity> {
  constructor(
    private readonly fileModel: Model<FileSchema>,
    private readonly fileMapper: FileMapper,
  ) {
    super(fileModel, fileMapper);
  }
}
