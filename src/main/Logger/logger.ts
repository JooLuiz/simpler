import ILogger from "./logger.interface";

class Logger implements ILogger {
  private isVerbose: boolean;

  constructor(isVerbose: boolean) {
    this.isVerbose = isVerbose;
  }

  public log(message: string) {
    console.log(message);
  }

  public logIfVerbose(message: string) {
    if (this.isVerbose) {
      this.log(message);
    }
  }

  public error(message: string) {
    console.error(message);
  }
}

export default Logger;
