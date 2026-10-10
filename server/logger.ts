/**
 * ProductPilot Centralized Observability & Logging Subsystem
 * Production structured logging (JSON in prod, human-readable in dev)
 * In-memory audit log ring-buffer for the Admin Panel
 */

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'AUDIT' | 'METRIC';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  action: string;
  user: string;
  ip: string;
  resource?: string;
  status: 'SUCCESS' | 'FAILURE';
  details?: Record<string, unknown>;
}

class Logger {
  private isProd = process.env.NODE_ENV === 'production';
  private auditLogs: AuditLogEntry[] = [];
  private readonly MAX_AUDIT_LOGS = 250;

  constructor() {
    // Seed initial startup audit entry
    this.audit({
      action: 'SYSTEM_BOOT',
      user: 'SYSTEM',
      ip: '127.0.0.1',
      resource: 'Core Server Engine',
      status: 'SUCCESS',
      details: { nodeVersion: process.version, env: process.env.NODE_ENV || 'development' },
    });
  }

  private formatMessage(level: LogLevel, message: string, meta?: Record<string, unknown>, requestId?: string): string {
    const timestamp = new Date().toISOString();
    if (this.isProd) {
      return JSON.stringify({
        timestamp,
        level,
        message,
        requestId,
        ...meta,
      });
    }
    const colorMap: Record<LogLevel, string> = {
      DEBUG: '\x1b[90m',
      INFO: '\x1b[36m',
      WARN: '\x1b[33m',
      ERROR: '\x1b[31m',
      AUDIT: '\x1b[35m',
      METRIC: '\x1b[32m',
    };
    const reset = '\x1b[0m';
    const reqStr = requestId ? ` [${requestId}]` : '';
    const metaStr = meta && Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${colorMap[level]}[${timestamp}] [${level}]${reqStr}${reset} ${message}${metaStr}`;
  }

  public debug(message: string, meta?: Record<string, unknown>, requestId?: string) {
    if (!this.isProd) {
      console.debug(this.formatMessage('DEBUG', message, meta, requestId));
    }
  }

  public info(message: string, meta?: Record<string, unknown>, requestId?: string) {
    console.info(this.formatMessage('INFO', message, meta, requestId));
  }

  public warn(message: string, meta?: Record<string, unknown>, requestId?: string) {
    console.warn(this.formatMessage('WARN', message, meta, requestId));
  }

  public error(message: string, err?: unknown, meta?: Record<string, unknown>, requestId?: string) {
    const errorDetails: Record<string, unknown> = { ...meta };
    if (err instanceof Error) {
      errorDetails.errorMessage = err.message;
      if (!this.isProd) {
        errorDetails.stack = err.stack;
      }
    } else if (err) {
      errorDetails.rawError = String(err);
    }
    console.error(this.formatMessage('ERROR', message, errorDetails, requestId));
  }

  public metric(name: string, value: number, unit = 'ms', meta?: Record<string, unknown>) {
    console.log(this.formatMessage('METRIC', `Metric: ${name}=${value}${unit}`, { metric: name, value, unit, ...meta }));
  }

  public audit(entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'level'>) {
    const auditRecord: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      level: 'AUDIT',
      ...entry,
    };

    // Prepend to ring buffer
    this.auditLogs.unshift(auditRecord);
    if (this.auditLogs.length > this.MAX_AUDIT_LOGS) {
      this.auditLogs.pop();
    }

    console.log(
      this.formatMessage('AUDIT', `[AUDIT] ${entry.user} -> ${entry.action} on ${entry.resource || 'SYSTEM'} (${entry.status})`, {
        ip: entry.ip,
        details: entry.details,
      })
    );
  }

  public getAuditLogs(limit = 50): AuditLogEntry[] {
    return this.auditLogs.slice(0, limit);
  }
}

export const logger = new Logger();
