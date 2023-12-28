export const grpcRequestMock = jest.fn();

export const grpcProxyMock = jest.fn(() => ({
  request: grpcRequestMock,
}));

export const apiRequestMock = jest.fn();

export const apiProxyMock = jest.fn(() => ({
  request: apiRequestMock,
}));

export const userProxyMock = jest.fn(() => ({
  findMe: jest.fn(() => ({
    first_name: 'test',
    last_name: 'test',
    phone: 'test',
    id: 'test',
  })),
}));
