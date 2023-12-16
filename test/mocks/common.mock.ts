export const grpcRequestMock = jest.fn();

export const grpcProxyMock = jest.fn(() => ({
  request: grpcRequestMock,
}));

export const apiRequestMock = jest.fn();

export const apiProxyMock = jest.fn(() => ({
  request: apiRequestMock,
}));
