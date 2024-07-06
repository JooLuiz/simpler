import http, { IncomingMessage, ServerResponse } from "http";
import Server from "../main/Server";

jest.mock("http");
jest.mock("fs/promises");

describe("Server", () => {
  let server: Server;
  let mockRequest: Partial<IncomingMessage>;
  let mockResponse: Partial<ServerResponse>;
  let mockEnd: jest.Mock;
  let mockWriteHead: jest.Mock;

  beforeEach(() => {
    server = new Server(true);

    mockRequest = {
      url: "/unknown",
      method: "GET",
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === "data") {
          callback("");
        }
        if (event === "end") {
          callback();
        }
      }),
    };

    mockResponse = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };
    mockWriteHead = jest.fn();
    mockResponse = {
      writeHead: mockWriteHead,
      end: mockEnd,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create and start the server on the specified port", () => {
    const listenMock = jest.fn();
    (http.createServer as jest.Mock).mockReturnValue({ listen: listenMock });

    const port = 3001;
    server.listen(port);

    expect(http.createServer).toHaveBeenCalled();
    expect(listenMock).toHaveBeenCalledWith(port, expect.any(Function));
  });

  it("should handle request and call route callback", () => {
    const route: Route = {
      url: "/test",
      method: ["GET"],
      callback: jest.fn(),
    };

    const pathVariables = { id: "123" };
    const queryParams = { search: "test" };
    const req = mockRequest as IncomingMessage;
    const res = mockResponse as ServerResponse;

    server.handleRequest(req, res, route, pathVariables, queryParams);

    req.on?.("end", () => {
      expect(route.callback).toHaveBeenCalledWith(
        req,
        res,
        "",
        pathVariables,
        queryParams
      );
    });
  });
});
