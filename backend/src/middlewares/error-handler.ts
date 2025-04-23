import { Request, Response, NextFunction } from 'express';
import { isCelebrateError } from 'celebrate';

const errorHandler = (error: any, _req: Request, res: Response, _next: NextFunction) => {
  if (isCelebrateError(error)) {
    return res.status(400).json({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Validation failed',
      validation: error.details,
    });
  }
  if (error.statusCode) {
    return res.status(error.statusCode).send({ message: error.message });
  }

  return res.status(500).send({ message: 'Ошибка сервера', error });
};

export default errorHandler;
