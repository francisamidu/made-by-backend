import { Request, Response, NextFunction } from 'express';
// Middleware to log request details
export const requestSizeLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('Content-Length:', req.headers['content-length']);
  console.log('Request Body:', req.body);

  // Optional: Check request size manually
  const bodySize = Buffer.byteLength(JSON.stringify(req.body || {}));
  console.log('Actual Body Size:', bodySize);

  next();
};
