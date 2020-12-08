import { GraphQLError } from 'graphql';

export const formatGqlError = (isDevMode: boolean) => (error: GraphQLError) => {
  if (isDevMode) {
    return error;
  }

  delete error.extensions.exception.stacktrace;

  return error;
};