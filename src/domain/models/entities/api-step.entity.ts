import { DataParamEntity } from './data-param.entity';

export class ApiStepEntity {
  public method: string;
  public url: string;
  public headers: DataParamEntity[];
  public params: DataParamEntity[];
  public body: DataParamEntity[];
  public query: DataParamEntity[];

  constructor(initial: Partial<ApiStepEntity>) {
    this.method = initial?.method;
    this.url = initial?.url;
    this.headers = initial?.headers || [];
    this.params = initial?.params || [];
    this.body = initial?.body || [];
    this.query = initial?.query || [];
  }
}
