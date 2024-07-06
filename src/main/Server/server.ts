import http, { IncomingMessage, ServerResponse } from "http";

import type IServer from "./server.interface";
import type IRouter from "../Router/router.interface";
import type ILogger from "../Logger/logger.interface";
import type IErrorHandler from "../ErrorHandler/errorHandler.interface";

import Router from "../Router";
import Logger from "../Logger";
import ErrorHandler from "../ErrorHandler";

import path from "path";
import { fileTypes } from "../../utils/consts";
import { readFile } from "fs/promises";

class Server implements IServer {
  private httpServer: http.Server | undefined;
  public router: IRouter;
  private logger: ILogger;
  public errorHandler: IErrorHandler;

  constructor(isVerbose: boolean = false) {
    this.router = new Router();
    this.logger = new Logger(isVerbose);
    this.errorHandler = new ErrorHandler(isVerbose);
  }

  public handleRequest(
    req: IncomingMessage,
    res: ServerResponse,
    route: Route,
    pathVariables: Record<string, string>,
    queryParams: Record<string, string>
  ) {
    let body = "";

    req.on("data", (chunk: unknown) => {
      if (chunk) {
        body += chunk.toString();
      }
    });

    req.on("end", async () => {
      try {
        this.logger.logIfVerbose(`Request Body: ${body}`);
        route.callback(req, res, body, pathVariables, queryParams);
      } catch (err: unknown) {
        this.errorHandler.handleError(res, err as Error);
      }
    });
  }

  private createServer() {
    const srvr = http.createServer(
      async (req: IncomingMessage, res: ServerResponse) => {
        try {
          console.log(req.url);
          const isStaticPage = await this.serveStaticFiles(req, res);
          if (isStaticPage) {
            return;
          }
          const route = this.router.getRoute(req.url, req.method);
          if (!route) {
            this.logger.logIfVerbose(`Route ${req.url} not Found`);
            this.response(
              res,
              404,
              "application/json",
              JSON.stringify({ message: "Route Not Found" })
            );
            return;
          }

          const pathVariables = this.router.getPathVariables(
            req.url,
            route.url
          );

          this.logger.logIfVerbose(
            `Path Variables: ${JSON.stringify(pathVariables)}`
          );

          const queryParams = this.router.getQueryParams(req.url);

          this.logger.logIfVerbose(
            `Query Params: ${JSON.stringify(queryParams)}`
          );

          this.handleRequest(req, res, route, pathVariables, queryParams);
        } catch (err: unknown) {
          this.errorHandler.handleError(res, err as Error);
        }
      }
    );

    this.httpServer = srvr;
  }

  public listen(port?: number) {
    if (!this.httpServer) {
      this.createServer();
    }

    if (this.httpServer) {
      this.httpServer.listen(port || 3000, () => {
        this.logger.log(
          `Simpler Server is Up and listening to http://localhost:${
            port || 3000
          }`
        );
      });
    }

    return this.httpServer;
  }

  async serveStaticFiles(
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<boolean> {
    if (!req.url) {
      return false;
    }

    const staticDirs = this.router.getStaticDirs();
    for (const dir of staticDirs) {
      const publicDirectory = path.join(__dirname, "../../", dir);
      const filePath = path.join(
        publicDirectory,
        req.url === "/" ? "index.html" : req.url || ""
      );
      this.logger.logIfVerbose(`Static File Path: ${filePath}`);
      const extname = String(path.extname(filePath)).toLowerCase();
      const contentType =
        fileTypes[extname as FILE_EXTENSIONS] || "application/octet-stream";
      try {
        const content = await readFile(filePath);
        this.response(res, 200, contentType, content);
        this.logger.logIfVerbose(`Loaded Static File:${filePath}`);
        return true;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
          this.logger.logIfVerbose((error as Error).message);
        }
      }
    }
    return false;
  }

  public async loadFile(res: ServerResponse, urlFile: string) {
    const filePath = path.join(__dirname, "../../", urlFile);
    console.log("load file file path", filePath);
    try {
      const content = await readFile(filePath);
      this.response(res, 200, "text/html", content);
      return;
    } catch (error) {
      this.errorHandler.handleError(res, error as Error);
    }
  }

  public response<T>(
    res: ServerResponse,
    status: number,
    contentType: string,
    message: T
  ) {
    res.writeHead(status, { "Content-Type": contentType });
    res.end(message);
  }
}

export default Server;
