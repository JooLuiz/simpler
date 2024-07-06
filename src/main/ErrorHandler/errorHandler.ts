import { ServerResponse } from "http";
import type ILogger from "../Logger/logger.interface";
import type IErrorHandler from "./errorHandler.interface";

import Logger from "../Logger";

class ErrorHandler implements IErrorHandler {
  private logger: ILogger;

  constructor(isVerbose: boolean) {
    this.logger = new Logger(isVerbose);
  }

  private defaultErrorHandler: HandleErrorFunction = (
    res: ServerResponse,
    error: Error
  ) => {
    this.logger.error(
      `An error happening when processing the callback: ${error.message}`
    );
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ message: "Internal Server Error", error: error.message })
    );
  };

  private customErrorHandler?: HandleErrorFunction;

  public handleError(res: ServerResponse, error: Error): void {
    if (this.customErrorHandler) {
      this.customErrorHandler(res, error);
    } else {
      this.defaultErrorHandler(res, error);
    }
  }

  public setCustomErrorHandler(handler: HandleErrorFunction): void {
    this.customErrorHandler = handler;
  }
}

export default ErrorHandler;
