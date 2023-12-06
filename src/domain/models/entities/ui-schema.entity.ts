export class UISchemaEntity {
  public key: string;
  public title: string;
  public type: string;
  public hint?: string;
  public min?: number;
  public max?: number;
  public regex?: string;
  public errorText?: string;
  public isRequired?: boolean;
  public isMoney?: boolean;
  public isEnglish?: boolean;
  public weight?: number;
  public trueText?: string;
  public falseText?: string;

  constructor(initial: Partial<UISchemaEntity>) {
    this.key = initial?.key;
    this.title = initial?.title;
    this.type = initial?.type;
    this.hint = initial?.hint;
    this.min = initial?.min;
    this.max = initial?.max;
    this.regex = initial?.regex;
    this.errorText = initial?.errorText;
    this.isRequired = initial?.isRequired || true;
    this.isMoney = initial?.isMoney || false;
    this.isEnglish = initial?.isEnglish || false;
    this.weight = initial?.weight || 1;
    this.trueText = initial?.trueText;
    this.falseText = initial?.falseText;
  }
}
