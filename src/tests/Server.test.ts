import http, { IncomingMessage, ServerResponse } from "http";
import Server from "../main/Server"; // Ajuste o caminho conforme necessário
import { readFile } from "fs/promises";
import path from "path";

jest.mock("http");
jest.mock("fs/promises");

describe("Server", () => {
  let server: Server;
  let mockRequest: Partial<IncomingMessage>;
  let mockResponse: Partial<ServerResponse>;

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

  it("should serve static files", async () => {
    (readFile as jest.Mock).mockResolvedValue("file content");

    const req = { url: "/test.txt" } as IncomingMessage;
    const res = mockResponse as ServerResponse;
    const staticDirsSpy = jest
      .spyOn(server.router, "getStaticDirs")
      .mockReturnValue(["static"]);
    const filePath = path.join(__dirname, "../main/static/test.txt");

    const result = await server.serveStaticFiles(req, res);

    expect(result).toBe(true);
    expect(readFile).toHaveBeenCalledWith(filePath);
    expect(mockResponse.writeHead).toHaveBeenCalledWith(200, {
      "Content-Type": "application/octet-stream",
    });
    expect(mockResponse.end).toHaveBeenCalledWith("file content");
    staticDirsSpy.mockRestore();
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
