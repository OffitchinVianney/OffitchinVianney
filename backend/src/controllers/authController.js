import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sanitizeHtml from 'sanitize-html';
import { supabaseAdmin } from '../config/supabase.js';
import { env } from '../config/env.js';
import { logEvent } from '../utils/logger.js';

function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });
}

function sanitizeText(input) {
  return sanitizeHtml(input || '', { allowedTags: [], allowedAttributes: {} });
}

export async function getCsrfToken(req, res) {
  return res.json({ csrfToken: req.csrfToken() });
}

export async function register(req, res, next) {
  try {
    const email = sanitizeText(req.body.email).toLowerCase();
    const fullName = sanitizeText(req.body.fullName);
    const passwordHash = await bcrypt.hash(req.body.password, 12);

    const { data: exists } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (exists) return res.status(409).json({ message: 'Email already in use' });

    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({ email, full_name: fullName, password_hash: passwordHash })
      .select('id,email,full_name,avatar_url,bio')
      .single();

    if (error) throw error;

    const token = signToken(data);
    res.cookie('access_token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: env.cookieSecure,
      maxAge: 15 * 60 * 1000
    });

    logEvent('info', 'User registered', { userId: data.id });
    return res.status(201).json({ user: data });
  } catch (err) {
    return next(err);
  }
}

export async function login(req, res, next) {
  try {
    const email = sanitizeText(req.body.email).toLowerCase();
    const password = req.body.password;

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id,email,full_name,password_hash,avatar_url,bio')
      .eq('email', email)
      .maybeSingle();

    if (error) throw error;
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(user);
    res.cookie('access_token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: env.cookieSecure,
      maxAge: 15 * 60 * 1000
    });

    delete user.password_hash;
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
}

export function logout(req, res) {
  res.clearCookie('access_token');
  return res.json({ message: 'Logged out' });
}
