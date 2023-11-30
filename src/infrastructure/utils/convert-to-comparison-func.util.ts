import { ComparisonFunctionEnum } from 'infrastructure/enum';

export const convertToComparisonFunc = (
  func: string,
): ComparisonFunctionEnum => {
  switch (func) {
    case ComparisonFunctionEnum.Eq:
      return ComparisonFunctionEnum.Eq;
    case ComparisonFunctionEnum.Ne:
      return ComparisonFunctionEnum.Ne;
    case ComparisonFunctionEnum.Gt:
      return ComparisonFunctionEnum.Gt;
    case ComparisonFunctionEnum.Gte:
      return ComparisonFunctionEnum.Gte;
    case ComparisonFunctionEnum.Lt:
      return ComparisonFunctionEnum.Lt;
    case ComparisonFunctionEnum.Lte:
      return ComparisonFunctionEnum.Lte;
    case ComparisonFunctionEnum.And:
      return ComparisonFunctionEnum.And;
    case ComparisonFunctionEnum.Nand:
      return ComparisonFunctionEnum.Nand;
    case ComparisonFunctionEnum.Or:
      return ComparisonFunctionEnum.Or;
    case ComparisonFunctionEnum.Nor:
      return ComparisonFunctionEnum.Nor;
    case ComparisonFunctionEnum.Xor:
      return ComparisonFunctionEnum.Xor;
    case ComparisonFunctionEnum.Xnor:
      return ComparisonFunctionEnum.Xnor;
    case ComparisonFunctionEnum.In:
      return ComparisonFunctionEnum.In;
    case ComparisonFunctionEnum.Nin:
      return ComparisonFunctionEnum.Nin;
    case ComparisonFunctionEnum.All:
      return ComparisonFunctionEnum.All;
    case ComparisonFunctionEnum.Not:
      return ComparisonFunctionEnum.Not;
    default:
      return ComparisonFunctionEnum.Eq;
  }
};
