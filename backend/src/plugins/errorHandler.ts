import {
  PG_FOREIGN_KEY_VIOLATION,
  PG_INVALID_TEXT_REPRESENTATION,
  PG_NOT_NULL_VIOLATION,
  PG_UNIQUE_VIOLATION,
} from '@drdgvhbh/postgres-error-codes';
import { httpErrors } from '@fastify/sensible';
import { FastifyError } from 'fastify';

import { FastifyReply } from 'fastify/types/reply';
import { FastifyRequest } from 'fastify/types/request';

const serverErrorHandler = (
  err: FastifyError & { code?: string },
  req: FastifyRequest,
  res: FastifyReply
) => {
  req.log.error({ err }, 'An unexpected error occurred');

  const isValidation = err.validation;
  const pgCode = err.code;

  let message = err.message;
  let statusCode =
    err.statusCode ?? httpErrors.internalServerError().statusCode;

  if (isValidation) {
    statusCode = httpErrors.badRequest().statusCode;
  } else if (pgCode) {
    message = 'An unexpected error occurred.';

    switch (pgCode) {
      case PG_UNIQUE_VIOLATION:
      case PG_FOREIGN_KEY_VIOLATION:
        statusCode = httpErrors.conflict().statusCode;
        break;
      case PG_NOT_NULL_VIOLATION:
      case PG_INVALID_TEXT_REPRESENTATION:
        statusCode = httpErrors.badRequest().statusCode;
        break;
      default:
        statusCode = httpErrors.internalServerError().statusCode;
    }
  }

  return res.code(statusCode).send({ message });
};

export default serverErrorHandler;
