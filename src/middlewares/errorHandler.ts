import { Request, Response, NextFunction } from 'express';
import logger from '../logger';

const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.error(`Error: ${err.message}`);
  res
    .status(err.status || 500)
    .json({ message: err.message || 'Internal Server Error' });
};

export default errorHandler;
