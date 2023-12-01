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
  is_sync: boolean;
  fail_step: string;
  is_final: boolean;
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
  validation_data?: string | undefined;
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
}

export interface CreateProcessRequest {
  name: string;
  roles: string[];
  default_fail_step?: string | undefined;
  allowed_direct_debit?: boolean | undefined;
  max_amount?: number | undefined;
  period?: string | undefined;
  cron?: string | undefined;
  validation_data?: string | undefined;
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
  validation_data?: string | undefined;
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
}

export interface UpdateAutopayResponse {
  meta: Meta | undefined;
  data?: Autopay | undefined;
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
