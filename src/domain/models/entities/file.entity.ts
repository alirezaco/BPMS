import { BaseEntity } from './base.entity';

export class FileEntity extends BaseEntity {
  name: string;
  value: string;

  constructor(initial: Partial<FileEntity>) {
    super(initial);

    this.name = initial?.name;
    this.value = initial?.value;
  }
}
