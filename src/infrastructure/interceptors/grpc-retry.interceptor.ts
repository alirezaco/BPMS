import { InterceptingCall, status as grpcStatus } from '@grpc/grpc-js';
import {
  FullListener,
  StatusObject,
} from '@grpc/grpc-js/build/src/call-interface';
import {
  FullRequester,
  InterceptorOptions,
  NextCall,
} from '@grpc/grpc-js/build/src/client-interceptors';

const maxRetries = 2;

const retryDelay = (count: number) => {
  return 50 * Math.pow(2, count);
};

type RetryFn = (
  message: any,
  metadata: any,
  retries: number,
  savedReceiveMessage: any,
  savedMessageNext: (message: any) => void,
  next: (status: StatusObject) => void,
) => void;

export const GrpcRetryInterceptor = function (
  options: InterceptorOptions,
  nextCall: NextCall,
) {
  let savedSendMessage: any;

  const requester: Partial<FullRequester> = {
    start: GrpcStartRequest(savedSendMessage, retry(options, nextCall)),
    sendMessage: function (message, next) {
      savedSendMessage = message;
      next(message);
    },
  };
  return new InterceptingCall(nextCall(options), requester);
};

const GrpcStartRequest = (savedSendMessage: any, retryFn: RetryFn) => {
  let savedReceiveMessage: any;
  let savedMessageNext: (message: any) => void;

  return function (metadata: any, _: any, next: any) {
    const savedMetadata = metadata;

    const newListener: Partial<FullListener> = {
      onReceiveMessage: function (message, next) {
        savedReceiveMessage = message;
        savedMessageNext = next;
      },
      onReceiveStatus: function (status, next) {
        let retries = 0;

        if (status.code !== grpcStatus.OK) {
          retryFn(
            savedSendMessage,
            savedMetadata,
            retries,
            savedReceiveMessage,
            savedMessageNext,
            next,
          );
        } else {
          savedMessageNext(savedReceiveMessage);
          next(status);
        }
      },
    };
    next(metadata, newListener);
  };
};

const retry = (options: InterceptorOptions, nextCall: NextCall) => {
  const retryFn: RetryFn = (
    message: any,
    metadata: any,
    retries: number,
    savedReceiveMessage: any,
    savedMessageNext: (message: any) => void,
    next: (status: StatusObject) => void,
  ) => {
    console.log('retries: ', retries);

    retries++;
    const newCall = nextCall(options);
    newCall.start(metadata, {
      onReceiveMessage: function (message) {
        savedReceiveMessage = message;
      },
      onReceiveStatus: function (status) {
        if (status.code !== grpcStatus.OK) {
          if (retries <= maxRetries) {
            setTimeout(() => {
              retryFn(
                message,
                metadata,
                retries,
                savedReceiveMessage,
                savedMessageNext,
                next,
              );
            }, retryDelay(retries));
          } else {
            savedMessageNext(savedReceiveMessage);
            next(status);
          }
        } else {
          savedMessageNext(savedReceiveMessage);
          next(status);
        }
      },
    });
  };

  return retryFn;
};
