import { ComparisonFunctionEnum } from 'infrastructure/enum';
import { DataParamEntity } from './data-param.entity';

export class ComparisonStepEntity {
  public func: ComparisonFunctionEnum;
  public left?: DataParamEntity;
  public right?: DataParamEntity;
  public children: ComparisonStepEntity[];

  constructor(initial: Partial<ComparisonStepEntity>) {
    this.func = initial?.func;
    this.left = initial?.left;
    this.right = initial?.right;
    this.children = initial?.children || [];
  }
}
