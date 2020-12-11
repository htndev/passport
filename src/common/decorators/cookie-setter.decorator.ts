import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Response, response } from 'express';

export const CookieSetter = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const context = GqlExecutionContext.create(ctx).getContext();
  // ! Default context does not has an append method
  context.req.append = response.append.bind(context.res);

  return (context?.res as Response)?.cookie.bind(context.res);
});
