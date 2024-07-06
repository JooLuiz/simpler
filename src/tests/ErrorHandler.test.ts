import { ServerResponse } from "http";
import Logger from "../main/Logger";
import ErrorHandler from "../main/ErrorHandler";

jest.mock("../main/Logger");

describe("ErrorHandler", () => {
  let errorHandler: ErrorHandler;
  let mockResponse: Partial<ServerResponse>;
  let mockEnd: jest.Mock;
  let mockWriteHead: jest.Mock;
  let mockLogger: jest.Mocked<Logger>;
  let mockErrorHandler: jest.Mock;

  beforeEach(() => {
    mockEnd = jest.fn();
    mockWriteHead = jest.fn();
    mockResponse = {
      writeHead: mockWriteHead,
      end: mockEnd,
    };
    mockLogger = new Logger(true) as jest.Mocked<Logger>;
    errorHandler = new ErrorHandler(true);
  });

  it("should handle error using default error handler", () => {
    const error = new Error("Test Error");

    errorHandler.handleError(mockResponse as ServerResponse, error);

    expect(mockWriteHead).toHaveBeenCalledWith(500, {
      "Content-Type": "application/json",
    });
    expect(mockEnd).toHaveBeenCalledWith(
      JSON.stringify({ message: "Internal Server Error", error: "Test Error" })
    );
  });

  it("should handle error using custom error handler if set", () => {
    const error = new Error("Test Error");
    mockErrorHandler = jest.fn();
    errorHandler.setCustomErrorHandler(mockErrorHandler);

    errorHandler.handleError(mockResponse as ServerResponse, error);

    expect(mockErrorHandler).toHaveBeenCalledWith(mockResponse, error);
    expect(mockLogger.error).not.toHaveBeenCalled();
    expect(mockWriteHead).not.toHaveBeenCalled();
    expect(mockEnd).not.toHaveBeenCalled();
  });
});
