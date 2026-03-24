import fs from 'fs';
import path from 'path';

const logDir = path.resolve('logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

export function logEvent(level, message, meta = {}) {
  const payload = {
    level,
    message,
    meta,
    timestamp: new Date().toISOString()
  };

  const line = `${JSON.stringify(payload)}\n`;
  fs.appendFileSync(path.join(logDir, 'app.log'), line, 'utf8');
  if (level !== 'info') {
    fs.appendFileSync(path.join(logDir, 'error.log'), line, 'utf8');
  }
}
