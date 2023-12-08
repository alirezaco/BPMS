import { ComparisonFunctionEnum } from 'infrastructure/enum';

export class ComparisonUtil {
  static compare(
    comparison: ComparisonFunctionEnum,
    left: any,
    right?: any,
  ): boolean {
    switch (comparison) {
      case ComparisonFunctionEnum.Eq:
        return left === right;
      case ComparisonFunctionEnum.Ne:
        return left !== right;
      case ComparisonFunctionEnum.Gt:
        return left > right;
      case ComparisonFunctionEnum.Gte:
        return left >= right;
      case ComparisonFunctionEnum.Lt:
        return left < right;
      case ComparisonFunctionEnum.Lte:
        return left <= right;
      case ComparisonFunctionEnum.And:
        return left && right;
      case ComparisonFunctionEnum.Nand:
        return !(left && right);
      case ComparisonFunctionEnum.Or:
        return left || right;
      case ComparisonFunctionEnum.Nor:
        return !(left || right);
      case ComparisonFunctionEnum.Xor:
        return left !== right;
      case ComparisonFunctionEnum.Xnor:
        return left === right;
      case ComparisonFunctionEnum.In:
        if (Array.isArray(right))
          return left.some((x: any) => right.includes(x));
      case ComparisonFunctionEnum.In:
        return left.includes(right);
      case ComparisonFunctionEnum.Nin:
        return !left.includes(right);
      case ComparisonFunctionEnum.All:
        return left.every((x: any) => right.includes(x));
      case ComparisonFunctionEnum.Not:
        return !left;
      default:
        return false;
    }
  }
}
