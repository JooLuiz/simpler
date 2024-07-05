import ILogger from "./logger.interface";

class Logger implements ILogger {
  constructor() {}

  log(message: string) {
    console.log(message);
  }

  logIfVerbose(message: string, isVerbose: boolean) {
    if (isVerbose) {
      this.log(message);
    }
  }

  error(message: string) {
    console.error(message);
  }
}

export default Logger;
