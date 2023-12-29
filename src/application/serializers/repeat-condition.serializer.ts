import { RepeatConditionEntity } from 'domain/models';
import { DataParamSerializer } from './data-param.serializer';

export class RepeatConditionSerializer {
  variable: DataParamSerializer;
  func: string;

  constructor(initial: RepeatConditionEntity) {
    this.variable = new DataParamSerializer(initial?.variable);
    this.func = initial?.func;
  }
}
