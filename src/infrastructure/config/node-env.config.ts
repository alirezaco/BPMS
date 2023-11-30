export function NODE_ENV(defenv = 'development') {
  return {
    IS_TEST: (process.env.NODE_ENV || defenv).toLowerCase().startsWith('test'),
    IS_PRODUCTION: (process.env.NODE_ENV || defenv)
      .toLowerCase()
      .startsWith('pro'),
    IS_DEVELOPMENT: (process.env.NODE_ENV || defenv)
      .toLowerCase()
      .startsWith('dev'),
  };
}
