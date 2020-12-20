import { UUID } from './../constants';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

export const GetUuid = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const context = GqlExecutionContext.create(ctx).getContext();
  const cookies = (context?.req as Request)?.signedCookies;

  return cookies[UUID] ?? null;
});
