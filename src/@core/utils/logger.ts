// logger.ts

enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

const logger = {
  debug: function(...args: any[]) {
    if (process.env.NODE_ENV !== 'production') {
      log(LogLevel.DEBUG, ...args);
    }
  },
  info: function(...args: any[]) {
    log(LogLevel.INFO, ...args);
  },
  warn: function(...args: any[]) {
    log(LogLevel.WARN, ...args);
  },
  error: function(...args: any[]) {
    log(LogLevel.ERROR, ...args);
  }
};

function log(level: LogLevel, ...args: any[]) {
  const prefix = `[${LogLevel[level].toUpperCase()}]`;
  const error = new Error();
  const callerLine = error.stack?.split('\n')[3];
  const caller = callerLine ? callerLine.trim().replace(/^\w+:\/\/[^/]+/, '') : '';
  // console[level === LogLevel.ERROR ? 'error' : 'log'](prefix, `${caller}:`, ...args);
  console[level === LogLevel.ERROR ? 'error' : 'log'](prefix, ...args, `\n${caller}`);
}

export default logger;
