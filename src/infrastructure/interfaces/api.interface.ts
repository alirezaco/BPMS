export class ApiInterface {
  url: string;
  method: string;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  body?: Record<string, string>;
  query?: Record<string, string>;
}
