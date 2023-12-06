import { UISchemaEntity } from 'domain/models';

export class UISchemaSerializer {
  key: string;
  title: string;
  type: string;
  hint?: string;
  min?: number;
  max?: number;
  regex?: string;
  error_text?: string;
  is_required?: boolean;
  is_money?: boolean;
  is_english?: boolean;
  weight?: number;
  true_text?: string;
  false_text?: string;

  constructor(initial: UISchemaEntity) {
    this.key = initial?.key;
    this.title = initial?.title;
    this.type = initial?.type;
    this.hint = initial?.hint;
    this.min = initial?.min;
    this.max = initial?.max;
    this.regex = initial?.regex;
    this.error_text = initial?.errorText;
    this.is_required = initial?.isRequired;
    this.is_money = initial?.isMoney;
    this.is_english = initial?.isEnglish;
    this.weight = initial?.weight;
    this.true_text = initial?.trueText;
    this.false_text = initial?.falseText;
  }
}
