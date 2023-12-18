import { DataParamEntity } from 'domain/models';

export class DataParamSerializer {
  source: string;
  key: string;
  source_key: string;

  constructor(initial: DataParamEntity) {
    this.source = initial?.source;
    this.key = initial?.key;
    this.source_key = initial?.sourceKey;
  }
}
