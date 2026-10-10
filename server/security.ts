import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { config } from './config';

const SESSION_SECRET = config.admin.sessionSecret;

// Password Hashing Architecture (PBKDF2/Scrypt using Node native crypto)
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, combinedHash: string): boolean {
  try {
    const [salt, storedHash] = combinedHash.split(':');
    if (!salt || !storedHash) return false;
    const computedHash = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(storedHash, 'hex'), Buffer.from(computedHash, 'hex'));
  } catch {
    return false;
  }
}

// Session Token Generation & Verification (HMAC-SHA256 signature)
export function createSessionToken(payload: { email: string; role: string; exp: number }): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
  return `${data}.${signature}`;
}

export function verifySessionToken(token: string): { email: string; role: string; exp: number } | null {
  try {
    const [data, signature] = token.split('.');
    if (!data || !signature) return null;
    const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

// Rate Limiting (Token Bucket per IP)
interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
}

const rateLimitBuckets = new Map<string, RateLimitBucket>();

export function createRateLimiter(maxRequests: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();
    let bucket = rateLimitBuckets.get(ip);

    if (!bucket) {
      bucket = { tokens: maxRequests, lastRefill: now };
      rateLimitBuckets.set(ip, bucket);
    } else {
      const elapsed = now - bucket.lastRefill;
      if (elapsed > windowMs) {
        bucket.tokens = maxRequests;
        bucket.lastRefill = now;
      }
    }

    if (bucket.tokens <= 0) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Rate limit exceeded. Please retry shortly.',
      });
    }

    bucket.tokens -= 1;
    next();
  };
}

// Input Sanitization helper
export function sanitizeInput(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim();
}

// Admin Auth Middleware
export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.productpilot_admin_session || req.headers['authorization']?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized. Admin credentials required.' });
  }

  const verified = verifySessionToken(token);
  if (!verified) {
    return res.status(401).json({ success: false, error: 'Invalid or expired session token.' });
  }

  (req as unknown as { adminUser: unknown }).adminUser = verified;
  next();
}
