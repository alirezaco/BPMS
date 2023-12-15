/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "autopay";

/** Common */
export interface Meta {
  status: number;
  message?: string | undefined;
}

export interface UISchema {
  key: string;
  title: string;
  type: string;
  hint?: string | undefined;
  min?: number | undefined;
  max?: number | undefined;
  regex?: string | undefined;
  error_text?: string | undefined;
  is_required?: boolean | undefined;
  is_money?: boolean | undefined;
  is_english?: boolean | undefined;
  weight?: number | undefined;
  true_text?: string | undefined;
  false_text?: string | undefined;
}

export interface DataParam {
  source: string;
  key: string;
  source_key: string;
}

export interface ComparisonStep {
  func: string;
  left?: DataParam | undefined;
  right?: DataParam | undefined;
  children: ComparisonStep[];
}

export interface GrpcStep {
  service: string;
  package: string;
  method: string;
  protofile: string;
  url: string;
  metadata: DataParam[];
  payload: DataParam[];
}

export interface ApiStep {
  url: string;
  method: string;
  headers: DataParam[];
  params: DataParam[];
  bodies: DataParam[];
  queries: DataParam[];
}

export interface Step {
  name: string;
  type: string;
  comparison?: ComparisonStep | undefined;
  grpc?: GrpcStep | undefined;
  api?: ApiStep | undefined;
  is_sync?: boolean | undefined;
  fail_step?: string | undefined;
  is_final?: boolean | undefined;
  is_payment?: boolean | undefined;
  payment_param?: DataParam | undefined;
}

export interface Process {
  id: string;
  owner: string;
  created_at: string;
  updated_at?: string | undefined;
  deleted_at?: string | undefined;
  restore_at?: string | undefined;
  tags: string[];
  name: string;
  roles: string[];
  default_fail_step?: string | undefined;
  allowed_direct_debit?: boolean | undefined;
  max_amount?: number | undefined;
  period?: string | undefined;
  cron?: string | undefined;
  ui_schema: UISchema[];
  steps: Step[];
  is_active?: boolean | undefined;
  data: string;
}

export interface ComparisonStepRequest {
  func: string;
  left?: DataParam | undefined;
  right?: DataParam | undefined;
  children: ComparisonStepRequest[];
}

export interface GrpcStepRequest {
  service: string;
  package: string;
  method: string;
  protofile: string;
  url: string;
  metadata: DataParam[];
  payload: DataParam[];
}

export interface ApiStepRequest {
  url: string;
  method: string;
  headers: DataParam[];
  params: DataParam[];
  bodies: DataParam[];
  queries: DataParam[];
}

export interface StepRequest {
  name: string;
  type: string;
  comparison?: ComparisonStep | undefined;
  grpc?: GrpcStep | undefined;
  api?: ApiStep | undefined;
  is_sync?: boolean | undefined;
  fail_step?: string | undefined;
  is_final?: boolean | undefined;
  is_payment?: boolean | undefined;
  payment_param?: DataParam | undefined;
}

export interface CreateProcessRequest {
  name: string;
  roles: string[];
  default_fail_step?: string | undefined;
  allowed_direct_debit?: boolean | undefined;
  max_amount?: number | undefined;
  period?: string | undefined;
  cron?: string | undefined;
  ui_schema: UISchema[];
  steps: Step[];
  data: string;
}

export interface CreateProcessResponse {
  meta: Meta | undefined;
  data?: Process | undefined;
}

export interface UpdateProcessRequest {
  id: string;
  name?: string | undefined;
  roles: string[];
  default_fail_step?: string | undefined;
  allowed_direct_debit?: boolean | undefined;
  max_amount?: number | undefined;
  period?: string | undefined;
  cron?: string | undefined;
  ui_schema: UISchema[];
  steps: Step[];
  data?: string | undefined;
  is_active?: boolean | undefined;
}

export interface UpdateProcessResponse {
  meta: Meta | undefined;
  data?: Process | undefined;
}

export interface DeleteProcessRequest {
  id: string;
}

export interface DeleteProcessResponse {
  meta: Meta | undefined;
  data?: Process | undefined;
}

export interface GetProcessRequest {
  id: string;
}

export interface GetProcessResponse {
  meta: Meta | undefined;
  data?: Process | undefined;
}

export interface Processes {
  id: string;
  owner: string;
  created_at: string;
  updated_at?: string | undefined;
  deleted_at?: string | undefined;
  restore_at?: string | undefined;
  tags: string[];
  name: string;
  roles: string[];
  allowed_direct_debit?: boolean | undefined;
  max_amount?: number | undefined;
  period?: string | undefined;
  cron?: string | undefined;
  is_active?: boolean | undefined;
}

export interface ArrayProcess {
  count: number;
  rows: Processes[];
}

export interface ListProcessesRequest {
  limit: number;
  skip: number;
}

export interface ListProcessesResponse {
  meta: Meta | undefined;
  data?: ArrayProcess | undefined;
}

export interface ListProcessesAdminRequest {
  limit: number;
  skip: number;
  name?: string | undefined;
  is_active?: boolean | undefined;
  roles: string[];
  allowed_direct_debit?: boolean | undefined;
}

export interface ListProcessesAdminResponse {
  meta: Meta | undefined;
  data?: ArrayProcess | undefined;
}

export interface Autopay {
  id: string;
  owner: string;
  created_at: string;
  updated_at?: string | undefined;
  deleted_at?: string | undefined;
  restore_at?: string | undefined;
  tags: string[];
  name: string;
  user_id: string;
  process_id: string;
  max_amount?: number | undefined;
  period: string;
  cron?: string | undefined;
  allowed_direct_debit: boolean;
  data: string;
  is_active: boolean;
  last_run_at: string;
  processing_status: string;
  ui_schema: UISchema[];
}

export interface CreateAutopayRequest {
  name: string;
  process_id: string;
  max_amount: number;
  period?: string | undefined;
  cron?: string | undefined;
  allowed_direct_debit?: boolean | undefined;
  data: string;
}

export interface CreateAutopayResponse {
  meta: Meta | undefined;
  data?: Autopay | undefined;
}

export interface UpdateAutopayRequest {
  id: string;
  name?: string | undefined;
  max_amount?: number | undefined;
  period?: string | undefined;
  cron?: string | undefined;
  allowed_direct_debit?: boolean | undefined;
  data?: string | undefined;
  is_active?: boolean | undefined;
}

export interface UpdateAutopayResponse {
  meta: Meta | undefined;
  data?: Autopay | undefined;
}

export interface DeleteAutopayRequest {
  id: string;
}

export interface DeleteAutopayResponse {
  meta: Meta | undefined;
  data?: Autopay | undefined;
}

export interface GetAutopayRequest {
  id: string;
}

export interface GetAutopayResponse {
  meta: Meta | undefined;
  data?: Autopay | undefined;
}

export interface Autopays {
  id: string;
  title: string;
  count: number;
  values: Autopay[];
}

export interface ArrayAutopay {
  count: number;
  rows: Autopays[];
}

export interface ListAutopayRequest {
  limit: number;
  skip: number;
  process_id?: string | undefined;
}

export interface ListAutopayResponse {
  meta: Meta | undefined;
  data?: ArrayAutopay | undefined;
}

export interface ListAutopayAdminRequest {
  limit: number;
  skip: number;
  name?: string | undefined;
  process_id?: string | undefined;
  status?: string | undefined;
  user_id?: string | undefined;
  period?: string | undefined;
  allowed_direct_debit?: boolean | undefined;
  is_active?: boolean | undefined;
}

export interface ArrayAutopays {
  count: number;
  rows: Autopay[];
}

export interface ListAutopayAdminResponse {
  meta: Meta | undefined;
  data?: ArrayAutopays | undefined;
}

export interface AutopayActivity {
  id: string;
  owner: string;
  created_at: string;
  updated_at?: string | undefined;
  deleted_at?: string | undefined;
  restore_at?: string | undefined;
  tags: string[];
  autopay_id: string;
  process_id: string;
  status: string;
  running_time: number;
  successful_steps: string[];
  failed_steps: string[];
  has_payment?: boolean | undefined;
  payment_amount?: number | undefined;
}

export interface ArrayAutopayActivity {
  count: number;
  rows: AutopayActivity[];
}

export interface ListAutopayActivityRequest {
  autopay_id?: string | undefined;
  process_id?: string | undefined;
  status?: string | undefined;
  start_date?: string | undefined;
  end_date?: string | undefined;
  has_payment?: boolean | undefined;
  limit: number;
  skip: number;
}

export interface ListAutopayActivityResponse {
  meta: Meta | undefined;
  data?: ArrayAutopayActivity | undefined;
}

export interface File {
  id: string;
  owner: string;
  created_at: string;
  updated_at?: string | undefined;
  deleted_at?: string | undefined;
  restore_at?: string | undefined;
  tags: string[];
  name: string;
  value: string;
}

export interface CreateFileRequest {
  name: string;
  value: string;
}

export interface CreateFileResponse {
  meta: Meta | undefined;
  data?: File | undefined;
}

export const AUTOPAY_PACKAGE_NAME = "autopay";

export interface AutopayServiceClient {
  createProcess(request: CreateProcessRequest, metadata?: Metadata): Observable<CreateProcessResponse>;

  updateProcess(request: UpdateProcessRequest, metadata?: Metadata): Observable<UpdateProcessResponse>;

  deleteProcess(request: DeleteProcessRequest, metadata?: Metadata): Observable<DeleteProcessResponse>;

  getProcess(request: GetProcessRequest, metadata?: Metadata): Observable<GetProcessResponse>;

  listProcesses(request: ListProcessesRequest, metadata?: Metadata): Observable<ListProcessesResponse>;

  listProcessesAdmin(request: ListProcessesAdminRequest, metadata?: Metadata): Observable<ListProcessesAdminResponse>;

  createAutopay(request: CreateAutopayRequest, metadata?: Metadata): Observable<CreateAutopayResponse>;

  updateAutopay(request: UpdateAutopayRequest, metadata?: Metadata): Observable<UpdateAutopayResponse>;

  deleteAutopay(request: DeleteAutopayRequest, metadata?: Metadata): Observable<DeleteAutopayResponse>;

  getAutopay(request: GetAutopayRequest, metadata?: Metadata): Observable<GetAutopayResponse>;

  listAutopays(request: ListAutopayRequest, metadata?: Metadata): Observable<ListAutopayResponse>;

  listAutopaysAdmin(request: ListAutopayAdminRequest, metadata?: Metadata): Observable<ListAutopayAdminResponse>;

  listAutopayActivity(
    request: ListAutopayActivityRequest,
    metadata?: Metadata,
  ): Observable<ListAutopayActivityResponse>;

  createFile(request: CreateFileRequest, metadata?: Metadata): Observable<CreateFileResponse>;
}

export interface AutopayServiceController {
  createProcess(
    request: CreateProcessRequest,
    metadata?: Metadata,
  ): Promise<CreateProcessResponse> | Observable<CreateProcessResponse> | CreateProcessResponse;

  updateProcess(
    request: UpdateProcessRequest,
    metadata?: Metadata,
  ): Promise<UpdateProcessResponse> | Observable<UpdateProcessResponse> | UpdateProcessResponse;

  deleteProcess(
    request: DeleteProcessRequest,
    metadata?: Metadata,
  ): Promise<DeleteProcessResponse> | Observable<DeleteProcessResponse> | DeleteProcessResponse;

  getProcess(
    request: GetProcessRequest,
    metadata?: Metadata,
  ): Promise<GetProcessResponse> | Observable<GetProcessResponse> | GetProcessResponse;

  listProcesses(
    request: ListProcessesRequest,
    metadata?: Metadata,
  ): Promise<ListProcessesResponse> | Observable<ListProcessesResponse> | ListProcessesResponse;

  listProcessesAdmin(
    request: ListProcessesAdminRequest,
    metadata?: Metadata,
  ): Promise<ListProcessesAdminResponse> | Observable<ListProcessesAdminResponse> | ListProcessesAdminResponse;

  createAutopay(
    request: CreateAutopayRequest,
    metadata?: Metadata,
  ): Promise<CreateAutopayResponse> | Observable<CreateAutopayResponse> | CreateAutopayResponse;

  updateAutopay(
    request: UpdateAutopayRequest,
    metadata?: Metadata,
  ): Promise<UpdateAutopayResponse> | Observable<UpdateAutopayResponse> | UpdateAutopayResponse;

  deleteAutopay(
    request: DeleteAutopayRequest,
    metadata?: Metadata,
  ): Promise<DeleteAutopayResponse> | Observable<DeleteAutopayResponse> | DeleteAutopayResponse;

  getAutopay(
    request: GetAutopayRequest,
    metadata?: Metadata,
  ): Promise<GetAutopayResponse> | Observable<GetAutopayResponse> | GetAutopayResponse;

  listAutopays(
    request: ListAutopayRequest,
    metadata?: Metadata,
  ): Promise<ListAutopayResponse> | Observable<ListAutopayResponse> | ListAutopayResponse;

  listAutopaysAdmin(
    request: ListAutopayAdminRequest,
    metadata?: Metadata,
  ): Promise<ListAutopayAdminResponse> | Observable<ListAutopayAdminResponse> | ListAutopayAdminResponse;

  listAutopayActivity(
    request: ListAutopayActivityRequest,
    metadata?: Metadata,
  ): Promise<ListAutopayActivityResponse> | Observable<ListAutopayActivityResponse> | ListAutopayActivityResponse;

  createFile(
    request: CreateFileRequest,
    metadata?: Metadata,
  ): Promise<CreateFileResponse> | Observable<CreateFileResponse> | CreateFileResponse;
}

export function AutopayServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "createProcess",
      "updateProcess",
      "deleteProcess",
      "getProcess",
      "listProcesses",
      "listProcessesAdmin",
      "createAutopay",
      "updateAutopay",
      "deleteAutopay",
      "getAutopay",
      "listAutopays",
      "listAutopaysAdmin",
      "listAutopayActivity",
      "createFile",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AutopayService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AutopayService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTOPAY_SERVICE_NAME = "AutopayService";
