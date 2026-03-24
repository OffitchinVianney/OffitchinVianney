import { logEvent } from '../utils/logger.js';

export function notFoundHandler(req, res) {
  return res.status(404).json({ message: 'Route not found' });
}

export function errorHandler(err, req, res, next) {
  logEvent('error', 'Unhandled server error', {
    path: req.path,
    method: req.method,
    error: err.message
  });

  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }

  return res.status(500).json({
    message: 'Internal server error'
  });
}
