import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

export const CookieGetter = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const context = GqlExecutionContext.create(ctx).getContext();

  return (context?.req as Request)?.signedCookies;
});
