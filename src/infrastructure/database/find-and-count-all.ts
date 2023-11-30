export type findAndCountAll<T> = { rows: T[]; count: number };

export type IOutput<T> = {
  result: 0 | 1;
  total?: number;
  data?: T | T[] | { [x: string]: any };
  errors?: any[];
};
