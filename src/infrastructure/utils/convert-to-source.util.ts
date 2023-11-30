import { SourceEnum } from 'infrastructure/enum/source.enum';

export const convertToSource = (source: string): SourceEnum => {
  switch (source) {
    case SourceEnum.PROCESS:
      return SourceEnum.PROCESS;
    case SourceEnum.AUTO_PAY:
      return SourceEnum.AUTO_PAY;
    case SourceEnum.BEFORE_STEP:
      return SourceEnum.BEFORE_STEP;
  }
};
