import { format } from 'date-fns';

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: Error;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Máximo número de logs a mantener en memoria
  private logLevels: Record<LogLevel, number> = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  };
  private currentLogLevel: LogLevel = 'debug'; // Nivel de log por defecto

  private constructor() {
    // Cargar logs previos del localStorage si existen
    this.loadLogs();
    
    // Guardar logs cuando la página se cierre o recargue
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.saveLogs());
    }
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private saveLogs() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          localStorage.setItem('app_logs', JSON.stringify(this.logs));
        } catch (error) {
          // Si hay un error de cuota excedida, mantener solo los logs más recientes
          if (error instanceof DOMException && error.name === 'QuotaExceededError') {
            this.logs = this.logs.slice(-Math.floor(this.maxLogs / 2));
            localStorage.setItem('app_logs', JSON.stringify(this.logs));
          } else {
            throw error;
          }
        }
      }
    } catch (error) {
      console.error('Error al guardar los logs:', error);
      // No lanzar el error para no interrumpir la ejecución de la aplicación
    }
  }

  private loadLogs() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedLogs = localStorage.getItem('app_logs');
        if (savedLogs) {
          try {
            const parsedLogs = JSON.parse(savedLogs);
            if (Array.isArray(parsedLogs)) {
              this.logs = parsedLogs;
            }
          } catch (parseError) {
            console.error('Error al analizar los logs guardados:', parseError);
            // Limpiar logs corruptos
            localStorage.removeItem('app_logs');
          }
        }
      }
    } catch (error) {
      console.error('Error al cargar los logs:', error);
      // No lanzar el error para no interrumpir la ejecución de la aplicación
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return this.logLevels[level] <= this.logLevels[this.currentLogLevel];
  }

  private addLog(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error) {
    const logEntry: LogEntry = {
      timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS'),
      level,
      message,
      context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } as Error : undefined,
    };

    // Añadir al array de logs
    this.logs.push(logEntry);

    // Mantener solo los últimos maxLogs registros
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Mostrar en consola según el nivel
    const consoleMethod = level === 'error' ? 'error' :
                         level === 'warn' ? 'warn' : 'log';
    
    console[consoleMethod](`[${logEntry.timestamp}] ${level.toUpperCase()}: ${message}`, 
      context || '', 
      error ? '\nError:' : '', 
      error || ''
    );

    return logEntry;
  }

  // Métodos públicos
  public setLogLevel(level: LogLevel) {
    this.currentLogLevel = level;
  }

  public error(message: string, error?: Error, context?: Record<string, unknown>) {
    if (!this.shouldLog('error')) return null;
    return this.addLog('error', message, context, error);
  }

  public warn(message: string, context?: Record<string, unknown>) {
    if (!this.shouldLog('warn')) return null;
    return this.addLog('warn', message, context);
  }

  public info(message: string, context?: Record<string, unknown>) {
    if (!this.shouldLog('info')) return null;
    return this.addLog('info', message, context);
  }

  public debug(message: string, context?: Record<string, unknown>) {
    if (!this.shouldLog('debug')) return null;
    return this.addLog('debug', message, context);
  }

  public getLogs(level?: LogLevel): LogEntry[] {
    if (!level) return [...this.logs];
    return this.logs.filter(log => log.level === level);
  }

  public clearLogs() {
    this.logs = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem('app_logs');
    }
  }

  public downloadLogs() {
    const data = JSON.stringify(this.logs, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs_${format(new Date(), 'yyyyMMdd_HHmmss')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const logger = Logger.getInstance();

export function logError(error: unknown, context?: Record<string, unknown>) {
  if (error instanceof Error) {
    return logger.error(error.message, error, context);
  }
  return logger.error(String(error), undefined, context);
}

export function logInfo(message: string, context?: Record<string, unknown>) {
  return logger.info(message, context);
}

export function logWarning(message: string, context?: Record<string, unknown>) {
  return logger.warn(message, context);
}

export function logDebug(message: string, context?: Record<string, unknown>) {
  return logger.debug(message, context);
}
