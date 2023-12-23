/* eslint-disable */
import { Metadata } from '@grpc/grpc-js';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Meta } from './autopay-grpc.interface';

export interface FindMeRequest {
  id: string;
}

export interface Profile {
  national_code?: string | undefined;
  birthdate?: string | undefined;
  state?: string | undefined;
  gender?: string | undefined;
  first_name?: string | undefined;
  last_name?: string | undefined;
  email?: string | undefined;
  avatar?: string | undefined;
  is_avatar_approved?: boolean | undefined;
  book_no?: number | undefined;
  book_row?: number | undefined;
  death_status?: boolean | undefined;
  father_name?: string | undefined;
  office_code?: number | undefined;
  office_name?: string | undefined;
  shenasname_no?: number | undefined;
  shenasname_seri?: string | undefined;
  shenasname_serial?: string | undefined;
  death_date?: string | undefined;
  zipcode?: string | undefined;
  zipcode_desc?: string | undefined;
  identity_verified?: boolean | undefined;
  /** common */
  owner?: string | undefined;
  groups: string[];
  partners: string[];
  tags: string[];
  created_at?: string | undefined;
  updated_at?: string | undefined;
  updated_by?: string | undefined;
  deleted_at?: string | undefined;
  deleted_by?: string | undefined;
  restored_at?: string | undefined;
  version?: string | undefined;
}

export interface Me {
  id: string;
  phone: string;
  status?: string | undefined;
  invited_by?: string | undefined;
  roles: string[];
  last_login_by?: string | undefined;
  profile?: Profile | undefined;
}

export interface FindMeResponse {
  meta: Meta | undefined;
  data?: Me | undefined;
}

export interface RoleGroup {
  client_id: string;
  roles: string[];
}

export interface FindUserByIdPayloadRequest {
  id: string;
}

export interface UserSchemaPayload {
  status?: string | undefined;
  phone: string;
  created_by_voucher?: string | undefined;
  iban?: string | undefined;
  invited_by?: string | undefined;
  roles: string[];
  role_groups: RoleGroup[];
  last_login_at?: string | undefined;
  last_login_by?: string | undefined;
  /** common */
  owner?: string | undefined;
  groups: string[];
  partners: string[];
  tags: string[];
  created_at?: string | undefined;
  updated_at?: string | undefined;
  updated_by?: string | undefined;
  deleted_at?: string | undefined;
  deleted_by?: string | undefined;
  restored_at?: string | undefined;
  version?: string | undefined;
}

export interface BaseQueryRequest {
  skip?: number | undefined;
  limit?: number | undefined;
  scope?: string | undefined;
  sort?: any | undefined;
  query: { [key: string]: string };
  update?: any | undefined;
  options?: any | undefined;
  projection?: any | undefined;
}

export interface BaseQueryRequest_QueryEntry {
  key: string;
  value: string;
}

export interface UserFilterPayloadRequest {
  filter: string;
}

export interface CreateUserPayload {
  status?: string | undefined;
  phone: string;
  created_by_voucher?: string | undefined;
  iban?: string | undefined;
  invited_by?: string | undefined;
  roles: string[];
  role_groups: RoleGroup[];
  last_login_at?: string | undefined;
  last_login_by?: string | undefined;
  /** common */
  tags: string[];
  other_data: { [key: string]: string };
}

export interface CreateUserPayload_OtherDataEntry {
  key: string;
  value: string;
}

export interface UpdateUserPayload {
  status?: string | undefined;
  phone: string;
  created_by_voucher?: string | undefined;
  iban?: string | undefined;
  invited_by?: string | undefined;
  roles: string[];
  role_groups: RoleGroup[];
  last_login_at?: string | undefined;
  last_login_by?: string | undefined;
  /** common */
  tags: string[];
  other_data: { [key: string]: string };
  query: BaseQueryRequest | undefined;
  request_param: { [key: string]: string };
}

export interface UpdateUserPayload_OtherDataEntry {
  key: string;
  value: string;
}

export interface UpdateUserPayload_RequestParamEntry {
  key: string;
  value: string;
}

export interface UserFindResponse {
  meta: Meta | undefined;
  data: UserSchemaPayload[];
}

export interface UserCreateResponse {
  meta: Meta | undefined;
  data?: UserSchemaPayload | undefined;
}

export interface UserCountResponse {
  meta: Meta | undefined;
  data: number;
}

export const USER_PACKAGE_NAME = 'user';

export interface UserServiceClient {
  create(
    request: CreateUserPayload,
    metadata?: Metadata,
  ): Observable<UserCreateResponse>;

  find(
    request: UserFilterPayloadRequest,
    metadata?: Metadata,
  ): Observable<UserFindResponse>;

  findById(
    request: FindUserByIdPayloadRequest,
    metadata?: Metadata,
  ): Observable<UserCreateResponse>;

  updateById(
    request: UpdateUserPayload,
    metadata?: Metadata,
  ): Observable<UserCreateResponse>;

  count(
    request: UserFilterPayloadRequest,
    metadata?: Metadata,
  ): Observable<UserCountResponse>;

  findMe(
    request: FindMeRequest,
    metadata?: Metadata,
  ): Observable<FindMeResponse>;
}

export interface UserServiceController {
  create(
    request: CreateUserPayload,
    metadata?: Metadata,
  ):
    | Promise<UserCreateResponse>
    | Observable<UserCreateResponse>
    | UserCreateResponse;

  find(
    request: UserFilterPayloadRequest,
    metadata?: Metadata,
  ):
    | Promise<UserFindResponse>
    | Observable<UserFindResponse>
    | UserFindResponse;

  findById(
    request: FindUserByIdPayloadRequest,
    metadata?: Metadata,
  ):
    | Promise<UserCreateResponse>
    | Observable<UserCreateResponse>
    | UserCreateResponse;

  updateById(
    request: UpdateUserPayload,
    metadata?: Metadata,
  ):
    | Promise<UserCreateResponse>
    | Observable<UserCreateResponse>
    | UserCreateResponse;

  count(
    request: UserFilterPayloadRequest,
    metadata?: Metadata,
  ):
    | Promise<UserCountResponse>
    | Observable<UserCountResponse>
    | UserCountResponse;

  findMe(
    request: FindMeRequest,
    metadata?: Metadata,
  ): Promise<FindMeResponse> | Observable<FindMeResponse> | FindMeResponse;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'create',
      'find',
      'findById',
      'updateById',
      'count',
      'findMe',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('UserService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('UserService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const USER_SERVICE_NAME = 'UserService';
