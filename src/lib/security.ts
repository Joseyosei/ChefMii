import { z } from 'zod';

export const emailSchema = z.string().email('Invalid email address').min(1, 'Email is required');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');

export const messageSchema = z
  .string()
  .min(1, 'Message cannot be empty')
  .max(5000, 'Message must be less than 5000 characters');

export const urlSchema = z.string().url('Invalid URL').refine(
  (url) => {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  },
  { message: 'Only HTTP and HTTPS URLs are allowed' }
);

export function sanitizeHTML(dirty: string): string {
  if (typeof window === 'undefined') {
    return dirty;
  }
  // Dynamically import DOMPurify only on client
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const DOMPurify = require('dompurify');
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  });
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return {
    success: false,
    errors: result.error.errors.map((err) => err.message),
  };
}

export const rateLimiter = (() => {
  const attempts = new Map<string, { count: number; timestamp: number }>();
  
  return {
    check: (key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean => {
      const now = Date.now();
      const record = attempts.get(key);
      
      if (!record || now - record.timestamp > windowMs) {
        attempts.set(key, { count: 1, timestamp: now });
        return true;
      }
      
      if (record.count >= maxAttempts) {
        return false;
      }
      
      record.count++;
      return true;
    },
    
    reset: (key: string): void => {
      attempts.delete(key);
    },
    
    cleanup: (): void => {
      const now = Date.now();
      for (const [key, record] of attempts.entries()) {
        if (now - record.timestamp > 3600000) {
          attempts.delete(key);
        }
      }
    },
  };
})();

if (typeof window !== 'undefined') {
  setInterval(() => rateLimiter.cleanup(), 300000);
}
