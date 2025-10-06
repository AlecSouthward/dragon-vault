import { FastifyError } from 'fastify';

import { FastifyReply } from 'fastify/types/reply';
import { FastifyRequest } from 'fastify/types/request';

const serverErrorHandler = (
  err: FastifyError & { code?: string },
  req: FastifyRequest,
  reply: FastifyReply
) => {
  req.log.error({ err }, 'An unexpected error occurred');

  const isValidation = err.validation;
  const pgCode = err.code;

  let status = err.statusCode ?? 500;
  let message = 'Internal server error';

  if (isValidation) {
    status = 400;
    message = 'Invalid request';
  } else if (pgCode) {
    switch (pgCode) {
      case '23505': // unique_violation
        status = 409;
        message = 'Resource already exists';
        break;
      case '23503': // foreign_key_violation
        status = 409;
        message = 'Related resource constraint failed';
        break;
      case '23502': // not_null_violation
        status = 400;
        message = 'Missing required field';
        break;
      case '22P02': // invalid_text_representation
        status = 400;
        message = 'Invalid input';
        break;
      default:
        status = 500;
        message = 'Database error';
    }
  }

  reply
    .code(status)
    .type('application/json')
    .send({
      message,
      code: (isValidation && 'VALIDATION_ERROR') || pgCode || 'INTERNAL_ERROR',
      requestId: req.id,
    });
};

export default serverErrorHandler;
