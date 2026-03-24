import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  cookieSecure: process.env.COOKIE_SECURE === 'true'
};

const required = ['supabaseUrl', 'supabaseAnonKey', 'supabaseServiceRoleKey', 'jwtSecret'];
for (const key of required) {
  if (!env[key]) {
    throw new Error(`Missing required env variable: ${key}`);
  }
}
