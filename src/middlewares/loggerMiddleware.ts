import { Request, Response, NextFunction } from 'express';
import logger from '../logger';
import { v6 as nanoid } from 'uuid'; // For generating unique request IDs

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const requestId = nanoid(); // Generate a unique request ID
  const startTime = process.hrtime();

  // Attach requestId to response headers (for tracing logs)
  res.setHeader('X-Request-ID', requestId);

  logger.info({
    requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    body: req.body, // Be cautious with logging sensitive data
    query: req.query,
    timestamp: new Date().toISOString(),
  });

  res.on('finish', () => {
    const diff = process.hrtime(startTime);
    const responseTime = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2); // Convert to ms

    logger.info({
      requestId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    });
  });

  next();
};

export default requestLogger;
