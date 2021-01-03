import { response } from 'express';

export const getBindContext = (context: Record<string, any>): any => {
  const _ctx = { ...context };

  _ctx.req.append = response.append.bind(_ctx.res);
  _ctx.res.cookie = _ctx.res.cookie.bind(_ctx.res);

  return _ctx;
};
