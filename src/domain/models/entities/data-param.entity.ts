import { SourceEnum } from 'infrastructure/enum/source.enum';

export class DataParamEntity {
  public source: SourceEnum;
  public key: string;
  public sourceKey: string;

  constructor(initial: Partial<DataParamEntity>) {
    this.source = initial?.source;
    this.key = initial?.key;
    this.sourceKey = initial?.sourceKey;
  }
}
