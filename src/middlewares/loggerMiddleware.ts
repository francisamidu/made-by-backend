import { Request, Response, NextFunction } from 'express';
import logger from '@/logger';
import { v6 as nanoid } from 'uuid'; // For generating unique request IDs

/**
 * Request logging middleware
 * Logs incoming requests and their responses for monitoring and debugging
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Generate unique ID for request tracking
  const requestId = nanoid();
  const startTime = process.hrtime();

  // Add request ID to response headers for client-side tracking
  res.setHeader('X-Request-ID', requestId);

  // Log incoming request details
  logger.info({
    requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    body: req.body,
    query: req.query,
    timestamp: new Date().toISOString(),
  });

  // Log response details when request is complete
  res.on('finish', () => {
    // Calculate request processing time
    const diff = process.hrtime(startTime);
    const responseTime = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);

    // Log response details
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
