import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateFileCommand } from './create-file.command';
import { FileFactory } from 'domain/services';
import { FileEntity } from 'domain/models';

@CommandHandler(CreateFileCommand)
export class CreateFileHandler implements ICommandHandler<CreateFileCommand> {
  constructor(private readonly fileFactory: FileFactory) {}

  async execute(command: CreateFileCommand): Promise<FileEntity> {
    const { fileEntity } = command;
    return this.fileFactory.create(fileEntity);
  }
}
