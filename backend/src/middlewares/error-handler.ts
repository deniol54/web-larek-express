import { Request, Response, NextFunction } from 'express';
import { isCelebrateError } from 'celebrate';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';

const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  if (isCelebrateError(error)) {
    const validation: Record<string, any> = {};
    for (const [segment, joiError] of error.details.entries()) {
      validation[segment] = {
        source: segment,
        keys: joiError.details.map((d) => d.path.join('.')),
        message: joiError.details.map((d) => d.message).join(', '),
      };
    }
    return res.status(400).json({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Validation failed',
      validation,
    });
  }
  if (error instanceof BadRequestError) {
    return res.status(error.statusCode).send({ message: error.message });
  }
  if (error instanceof ConflictError) {
    return res.status(error.statusCode).send({ message: error.message });
  }
  if (error instanceof NotFoundError) {
    return res.status(error.statusCode).send({ message: error.message });
  }

  return res.status(500).send({ message: 'Ошибка сервера' });
};

export default errorHandler;
