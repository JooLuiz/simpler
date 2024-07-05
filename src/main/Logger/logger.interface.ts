interface ILogger {
  log: (message: string) => void;
  logIfVerbose: (message: string, isVerbose: boolean) => void;
  error: (message: string) => void;
}

export default ILogger;
