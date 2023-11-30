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
}

export interface Process {
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

export const AUTOPAY_PACKAGE_NAME = "autopay";

export interface AutopayServiceClient {
  createProcess(request: CreateProcessRequest, metadata?: Metadata): Observable<CreateProcessResponse>;
}

export interface AutopayServiceController {
  createProcess(
    request: CreateProcessRequest,
    metadata?: Metadata,
  ): Promise<CreateProcessResponse> | Observable<CreateProcessResponse> | CreateProcessResponse;
}

export function AutopayServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createProcess"];
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
