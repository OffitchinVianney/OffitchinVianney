import app from './app.js';
import { env } from './config/env.js';
import { logEvent } from './utils/logger.js';

app.listen(env.port, () => {
  logEvent('info', `Server running on port ${env.port}`);
  console.log(`API running on http://localhost:${env.port}`);
});
