import { ApiStepEntity } from 'domain/models';
import { DataParamSerializer } from './data-param.serializer';

export class ApiStepSerializer {
  url: string;
  method: string;
  headers: DataParamSerializer[];
  params: DataParamSerializer[];
  bodies: DataParamSerializer[];
  queries: DataParamSerializer[];

  constructor(initial: ApiStepEntity) {
    this.url = initial?.url;
    this.method = initial?.method;
    this.headers = initial?.headers?.map(
      (header) => new DataParamSerializer(header),
    );
    this.params = initial?.params?.map(
      (param) => new DataParamSerializer(param),
    );
    this.bodies = initial?.body?.map((body) => new DataParamSerializer(body));
    this.queries = initial?.query?.map(
      (query) => new DataParamSerializer(query),
    );
  }
}
