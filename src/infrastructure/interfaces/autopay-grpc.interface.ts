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

export interface CreateProcessRequest {
  name: string;
}

export interface CreateProcessResponse {
  meta: Meta | undefined;
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
