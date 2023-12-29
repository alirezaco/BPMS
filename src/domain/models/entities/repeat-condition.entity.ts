import { ComparisonFunctionEnum } from 'infrastructure/enum';
import { DataParamEntity } from './data-param.entity';

export class RepeatConditionEntity {
  variable: DataParamEntity;
  func: ComparisonFunctionEnum;

  constructor(initial: Partial<RepeatConditionEntity>) {
    this.variable = initial?.variable;
    this.func = initial?.func;
  }
}
