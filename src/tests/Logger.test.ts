import Logger from "../main/Logger";

describe("Logger", () => {
  let logger: Logger;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new Logger();
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("log should call console.log with the correct message", () => {
    const message = "Test log message";
    logger.log(message);
    expect(consoleLogSpy).toHaveBeenCalledWith(message);
  });

  test("logIfVerbose should call log if isVerbose is true", () => {
    const message = "Verbose log message";
    logger.logIfVerbose(message, true);
    expect(consoleLogSpy).toHaveBeenCalledWith(message);
  });

  test("logIfVerbose should not call log if isVerbose is false", () => {
    const message = "Non-verbose log message";
    logger.logIfVerbose(message, false);
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  test("error should call console.error with the correct message", () => {
    const message = "Test error message";
    logger.error(message);
    expect(consoleErrorSpy).toHaveBeenCalledWith(message);
  });
});
