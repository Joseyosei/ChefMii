# ChefMii Security Implementation

## Overview

This document outlines the comprehensive security measures implemented in the ChefMii application to protect user data and prevent common web vulnerabilities.

## Security Features Implemented

### 1. Input Validation & Sanitization

**Location**: `src/lib/security.ts`

- **Zod Schema Validation**: All user inputs are validated using Zod schemas
  - Email validation with proper format checking
  - Password strength requirements (8+ chars, uppercase, lowercase, number, special character)
  - Name validation (2-100 chars, letters/spaces/hyphens/apostrophes only)
  - Message length limits (1-5000 chars)
  - URL validation (HTTP/HTTPS only)

- **DOMPurify Integration**: HTML content is sanitized to prevent XSS attacks
  - Allowed tags: `b`, `i`, `em`, `strong`, `a`, `p`, `br`
  - Allowed attributes: `href`, `target`, `rel`
  - Data attributes disabled

- **HTML Escaping**: Special characters escaped in user-generated content

### 2. Authentication Security

**Enhanced Features**:
- PKCE flow enabled for Supabase authentication
- Rate limiting on login (5 attempts per 5 minutes)
- Rate limiting on registration (3 attempts per 5 minutes)
- Secure session management via Supabase
- HttpOnly cookies for token storage (via Supabase)

**Password Requirements**:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### 3. Database Security (Row Level Security)

**RLS Policies Enabled** on all tables:

#### Profiles Table
- Users can view their own profile
- Users can update their own profile
- Users can insert their own profile

#### Chefs Table
- Authenticated users can view all chef profiles
- Chefs can update only their own profile
- Chefs can insert only their own profile

#### Bookings Table
- Users can view bookings they created
- Chefs can view bookings for their services
- Users can create new bookings
- Both users and chefs can update relevant bookings

#### Messages Table
- Users can view messages they sent
- Users can view messages they received
- Users can send messages
- Users can update (mark as read) messages they received

**Database Indexes**:
- Optimized indexes on user_id, role, chef_id, status columns
- Performance-optimized for RLS policy checks

### 4. Security Headers

**Implemented in** `index.html`:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Content-Security-Policy: [See full policy in index.html]
```

**Note**: These headers in `<meta>` tags provide defense-in-depth. For production, configure them on your web server/CDN.

### 5. Content Security Policy (CSP)

Restricts resource loading to:
- Scripts: Self only (with unsafe-inline/unsafe-eval for Vite dev)
- Styles: Self + Google Fonts
- Fonts: Self + Google Fonts Static
- Images: Self + data URIs + HTTPS
- Connect: Self + Supabase + Google Fonts
- Frames: Denied (frame-ancestors 'none')

### 6. Rate Limiting

**Client-Side Rate Limiter** (`src/lib/security.ts`):
- In-memory rate limiting for login/registration
- Configurable attempts and time windows
- Automatic cleanup of old records

**Applied To**:
- Login: 5 attempts per 5 minutes per email
- Registration: 3 attempts per 5 minutes per email

### 7. Environment Variable Security

**Validation** (`src/lib/env.ts`):
- Validates all required environment variables
- Ensures SUPABASE_URL uses HTTPS
- Logs errors for missing/invalid variables
- Lazy loading to prevent import-time errors

**Best Practices**:
- Never commit `.env` files
- Use environment-specific configurations
- Validate on application startup

### 8. Runtime Security Policies

**SecurityProvider** (`src/components/SecurityProvider.tsx`):
- Freezes Object.prototype to prevent prototype pollution
- Validates and sanitizes window.open calls
- Blocks unsafe link protocols (only allows http/https/relative/#)
- Event middleware for click interception

## Security Checklist

- [x] Input validation on all forms
- [x] HTML sanitization for user content
- [x] Rate limiting on authentication
- [x] Row Level Security policies
- [x] Secure password requirements
- [x] PKCE authentication flow
- [x] Security headers (CSP, X-Frame-Options, etc.)
- [x] Environment variable validation
- [x] URL validation and sanitization
- [x] XSS prevention measures
- [x] CSRF protection via Supabase
- [x] Database indexes for RLS performance
- [x] Prototype pollution prevention

## Recommendations for Production

### Server-Side Security Headers
Configure these on your web server (Nginx/Apache) or CDN:

```nginx
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; ..." always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### Additional Measures

1. **SSL/TLS**: Ensure HTTPS is enforced everywhere
2. **API Rate Limiting**: Implement server-side rate limiting
3. **WAF**: Consider using a Web Application Firewall
4. **Monitoring**: Set up security monitoring and logging
5. **Dependency Scanning**: Regularly run `npm audit`
6. **Penetration Testing**: Conduct regular security audits
7. **Backup**: Implement database backup strategy
8. **DDoS Protection**: Use CDN with DDoS protection

## Security Updates

- Run `npm audit` regularly
- Keep dependencies updated
- Monitor Supabase security advisories
- Review and update RLS policies as features evolve

## Reporting Security Issues

If you discover a security vulnerability, please email: security@chefmii.com

**Do not** create public GitHub issues for security vulnerabilities.

---

Last Updated: December 2025
