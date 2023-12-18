import { FileEntity } from 'domain/models';

export class FileSerializer {
  id: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  restored_at?: string;
  owner: string;
  tags: string[];
  name: string;
  value: string;

  constructor(initial: FileEntity) {
    this.id = initial?.id;
    this.created_at = initial?.createdAt.toISOString();
    this.updated_at = initial?.updatedAt?.toISOString();
    this.deleted_at = initial?.deletedAt?.toISOString();
    this.restored_at = initial?.restoreAt?.toISOString();
    this.owner = initial?.owner;
    this.tags = initial?.tags;
    this.name = initial?.name;
    this.value = initial?.value;
  }
}
