import { GqlExecutionContext } from '@nestjs/graphql';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserJwtPayload } from '../utils/types';

export const CurrentUser = createParamDecorator(
  (_, ctx: ExecutionContext): UserJwtPayload => {
    const context = GqlExecutionContext.create(ctx).getContext();
    return context.req.user;
  }
);
