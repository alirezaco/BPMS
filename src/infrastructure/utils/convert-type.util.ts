import { UITypeEnum, ValidationTypeEnum } from 'infrastructure/enum';

export const convertType = (val: string) => {
  switch (val) {
    case UITypeEnum.BOOLEAN:
      return ValidationTypeEnum.BOOLEAN;
    case UITypeEnum.DATE:
      return ValidationTypeEnum.DATE;
    case UITypeEnum.FLOAT:
      return ValidationTypeEnum.NUMBER;
    case UITypeEnum.INT:
      return ValidationTypeEnum.NUMBER;
    case UITypeEnum.STRING:
      return ValidationTypeEnum.STRING;
    default:
      return ValidationTypeEnum.STRING;
  }
};
