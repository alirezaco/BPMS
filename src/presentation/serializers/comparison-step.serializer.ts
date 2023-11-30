import { ComparisonStepEntity } from 'domain/models';
import { DataParamSerializer } from './data-param.serializer';

export class ComparisonStepSerializer {
  func: string;
  left?: DataParamSerializer | undefined;
  right?: DataParamSerializer | undefined;
  children: ComparisonStepSerializer[];

  constructor(initial: ComparisonStepEntity) {
    this.func = initial?.func;
    this.left = initial?.left
      ? new DataParamSerializer(initial?.left)
      : undefined;
    this.right = initial?.right
      ? new DataParamSerializer(initial?.right)
      : undefined;
    this.children = initial?.children
      ? initial?.children.map((child) => new ComparisonStepSerializer(child))
      : [];
  }
}
