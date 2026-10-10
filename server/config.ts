/**
 * ProductPilot Enterprise Configuration Manager
 * Validates, loads, and securely manages environment variables across Development, Staging, and Production.
 */

export interface SystemConfig {
  env: 'development' | 'staging' | 'production';
  isProd: boolean;
  isStaging: boolean;
  isDev: boolean;
  port: number;
  baseUrl: string;
  admin: {
    email: string;
    sessionSecret: string;
    sessionDurationMs: number;
  };
  security: {
    rateLimitMax: number;
    rateLimitWindowMs: number;
    corsAllowedOrigins: string[];
    enableStrictCsp: boolean;
  };
  email: {
    provider: 'console' | 'smtp' | 'sendgrid' | 'resend' | 'ses';
    fromAddress: string;
    fromName: string;
    smtpHost?: string;
    smtpPort?: number;
    smtpUser?: string;
    smtpPass?: string;
    apiKey?: string;
  };
  affiliateDefaults: {
    amazonTag: string;
    ebayCampaignId: string;
    aliExpressSubId: string;
    darazAffiliateId: string;
  };
  analytics: {
    ga4MeasurementId: string;
    gtmContainerId: string;
  };
}

const nodeEnv = (process.env.NODE_ENV || 'development').toLowerCase();
const env: 'development' | 'staging' | 'production' =
  nodeEnv === 'production' ? 'production' : nodeEnv === 'staging' ? 'staging' : 'development';

export const config: SystemConfig = {
  env,
  isProd: env === 'production',
  isStaging: env === 'staging',
  isDev: env === 'development',
  port: Number(process.env.PORT) || 3000,
  baseUrl: process.env.BASE_URL || process.env.APP_URL || 'https://productpilot.com',
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@productpilot.com',
    sessionSecret:
      process.env.ADMIN_SESSION_SECRET ||
      (env === 'production'
        ? (() => {
            throw new Error('CRITICAL: ADMIN_SESSION_SECRET must be set in production!');
          })()
        : 'productpilot-dev-secret-key-2026'),
    sessionDurationMs: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
  security: {
    rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || 120,
    rateLimitWindowMs: 60 * 1000, // 1 minute
    corsAllowedOrigins: (process.env.CORS_ALLOWED_ORIGINS || '').split(',').filter(Boolean),
    enableStrictCsp: env === 'production',
  },
  email: {
    provider: (process.env.EMAIL_PROVIDER as SystemConfig['email']['provider']) || 'console',
    fromAddress: process.env.EMAIL_FROM || 'editorial@productpilot.com',
    fromName: process.env.EMAIL_FROM_NAME || 'ProductPilot Editorial Desk',
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    apiKey: process.env.EMAIL_API_KEY,
  },
  affiliateDefaults: {
    amazonTag: process.env.AMAZON_AFFILIATE_TAG || 'pilot-20',
    ebayCampaignId: process.env.EBAY_CAMPAIGN_ID || '533890123',
    aliExpressSubId: process.env.ALIEXPRESS_SUB_ID || 'pilot-ali',
    darazAffiliateId: process.env.DARAZ_AFFILIATE_ID || 'pilot-daraz-global',
  },
  analytics: {
    ga4MeasurementId: process.env.GA4_MEASUREMENT_ID || 'G-PILOT2026XX',
    gtmContainerId: process.env.GTM_CONTAINER_ID || 'GTM-PILOT98',
  },
};

/**
 * Masks sensitive credentials for safe diagnostics and logs.
 */
export function maskSecret(secret?: string | null): string {
  if (!secret) return '(not configured)';
  if (secret.length <= 4) return '****';
  return secret.slice(0, 2) + '****' + secret.slice(-2);
}

/**
 * Validates configuration and returns diagnostic status for system health reports.
 */
export function validateEnvironment(): {
  isValid: boolean;
  warnings: string[];
  environment: string;
  diagnostics: Record<string, string>;
} {
  const warnings: string[] = [];

  if (config.isProd && (!process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET.length < 16)) {
    warnings.push('ADMIN_SESSION_SECRET is using a weak or default value in production.');
  }

  if (config.isProd && config.email.provider === 'console') {
    warnings.push('Email provider is set to "console" in production. Outbound emails will only be logged.');
  }

  return {
    isValid: warnings.length === 0,
    warnings,
    environment: config.env,
    diagnostics: {
      Environment: config.env,
      'Base URL': config.baseUrl,
      'Admin Email': config.admin.email,
      'Admin Secret': maskSecret(config.admin.sessionSecret),
      'Email Provider': config.email.provider,
      'Email Sender': `${config.email.fromName} <${config.email.fromAddress}>`,
      'Amazon Tag': config.affiliateDefaults.amazonTag,
      'GA4 Measurement ID': config.analytics.ga4MeasurementId,
      'Node Version': process.version,
    },
  };
}
