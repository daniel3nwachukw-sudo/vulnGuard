import jwt, { SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';

const JWT_SECRET = (process.env.JWT_SECRET ?? 'dev-secret-change-me') as string;
const TOKEN_NAME = 'vulnguard_token';

export function signToken(payload: object, expiresIn: string | number = '7d') {
  const options: SignOptions = { expiresIn: expiresIn as StringValue | number };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export function buildSetCookie(token: string, maxAgeSec = 7 * 24 * 60 * 60) {
  const secure = process.env.NODE_ENV === 'production';
  const parts = [
    `${TOKEN_NAME}=${token}`,
    'HttpOnly',
    'Path=/',
    `Max-Age=${maxAgeSec}`,
    'SameSite=Strict',
  ];
  if (secure) {
    parts.push('Secure');
  }
  return parts.join('; ');
}

export function buildClearCookie() {
  const secure = process.env.NODE_ENV === 'production';
  const parts = [
    `${TOKEN_NAME}=deleted`,
    'HttpOnly',
    'Path=/',
    'Max-Age=0',
    'SameSite=Strict',
  ];
  if (secure) {
    parts.push('Secure');
  }
  return parts.join('; ');
}