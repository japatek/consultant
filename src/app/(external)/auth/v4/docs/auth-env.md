# Environment Variables — JaPa Auth.js v5

Copy this to `.env.local` (development) or your deployment secret manager (production).
**Never commit real secrets to version control.**

---

## Auth.js Core

```env
# Required. Min 32 chars. Generate with:
#   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
AUTH_SECRET=change_me_to_a_64_char_random_hex_string

# Base URL of the app — used to build callback and verification URLs.
# No trailing slash.
NEXT_PUBLIC_BASE_URL=http://localhost:3000        # dev
# NEXT_PUBLIC_BASE_URL=https://app.JaPa.com     # prod
```

---

## Google OAuth

Create credentials at https://console.cloud.google.com → APIs & Services → Credentials.
Add `http://localhost:3000/api/auth/callback/google` (dev) and your production callback URL.

```env
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## Email — Development (Resend)

Sign up at https://resend.com. Verify your domain, then create an API key.

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Must match a verified sender in your Resend domain.
EMAIL_FROM=JaPa <noreply@yourdomain.com>
```

---

## Email — Production (Nodemailer / SMTP)

Switch is automatic when `NODE_ENV=production`.

```env
SMTP_HOST=smtp.yourmailprovider.com
SMTP_PORT=587
SMTP_SECURE=false        # true for port 465
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password

EMAIL_FROM=JaPa <noreply@yourdomain.com>
```

---

## Database (Prisma + PostgreSQL)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/JaPa_db?schema=public
```

---

## GoCaptcha

Run the Go captcha service locally or deploy it.
Repository: https://github.com/wenlng/go-captcha

```env
# Base URL of your GoCaptcha API (no trailing slash, no /get or /check suffix)
GOCAPTCHA_API_URL=http://localhost:8080/api/go-captcha

# Shared secret sent in X-Captcha-Key header for server-to-server calls
GOCAPTCHA_SECRET=your_gocaptcha_shared_secret
```

---

## App Metadata

```env
NEXT_PUBLIC_APP_NAME=JaPa
```

---

## Security Notes

| Variable          | Exposure       | Risk if leaked                         |
|-------------------|----------------|----------------------------------------|
| AUTH_SECRET       | Server only    | Session forgery — rotate immediately   |
| GOOGLE_CLIENT_SECRET | Server only | OAuth token theft                      |
| RESEND_API_KEY    | Server only    | Email spam / phishing via your domain  |
| SMTP_PASS         | Server only    | Email spam / phishing                  |
| GOCAPTCHA_SECRET  | Server only    | Captcha bypass                         |
| DATABASE_URL      | Server only    | Full database access                   |
| GOOGLE_CLIENT_ID  | Public (safe)  | Low risk — needed for browser OAuth    |
| NEXT_PUBLIC_BASE_URL | Public     | Low risk                               |
| NEXT_PUBLIC_APP_NAME | Public     | No risk                                |

---

## Checklist — Before Going to Production

- [ ] `AUTH_SECRET` is at least 64 hex characters and unique per environment
- [ ] `NEXT_PUBLIC_BASE_URL` points to your real HTTPS domain
- [ ] Google OAuth redirect URI is registered for the production domain
- [ ] Resend domain is verified (or SMTP credentials are valid)
- [ ] `DATABASE_URL` points to a production PostgreSQL instance with TLS
- [ ] `NODE_ENV=production` is set in the deployment environment
- [ ] Cookies will use `__Secure-` and `__Host-` prefixes (requires HTTPS)
- [ ] GoCaptcha service is deployed and accessible from the Next.js server
