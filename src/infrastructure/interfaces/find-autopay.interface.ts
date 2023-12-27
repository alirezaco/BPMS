export interface FindAutopayInterface<T> {
  id: string;
  name: string;
  service_name: string;
  count: number;
  values: T[];
}
