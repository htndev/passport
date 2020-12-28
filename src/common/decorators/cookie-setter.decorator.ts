import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { getBindContext } from './../utils/cookie-context-binder';

export const CookieSetter = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const _ctx = GqlExecutionContext.create(ctx).getContext();
  const context = getBindContext(_ctx);

  return context.res.cookie;
});
