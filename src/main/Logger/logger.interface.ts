interface ILogger {
  log: LoggerFunction;
  logIfVerbose: LoggerFunction;
  error: LoggerFunction;
}

export default ILogger;
