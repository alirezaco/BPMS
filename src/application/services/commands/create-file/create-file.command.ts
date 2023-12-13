import { FileEntity } from 'domain/models';

export class CreateFileCommand {
  constructor(public fileEntity: FileEntity) {}
}
