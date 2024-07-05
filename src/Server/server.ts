import http, { IncomingMessage, ServerResponse } from "http";
import type IServer from "./server.interface";
import type IRouter from "../Router/router.interface";
import type ILogger from "../Logger/logger.interface";
import Router from "../Router";
import Logger from "../Logger";
import path from "path";
import { fileTypes } from "../utils/consts";
import { readFile } from "fs/promises";

class Server implements IServer {
  private httpServer: http.Server | undefined;
  private isVerbose: boolean;
  public router: IRouter;
  private logger: ILogger;

  constructor(isVerbose: boolean = false) {
    this.router = new Router();
    this.logger = new Logger();
    this.isVerbose = isVerbose;
  }

  handleRequest(
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
        this.logger.logIfVerbose(`Request Body: ${body}`, this.isVerbose);
        route.callback(req, res, body, pathVariables, queryParams);
      } catch (err: unknown) {
        this.logger.error(
          `An error happening when processing the callback: ${
            (err as Error).message
          }`
        );
        this.errorResponse(res, err as Error);
      }
    });
  }

  private createServer() {
    const srvr = http.createServer(
      async (req: IncomingMessage, res: ServerResponse) => {
        try {
          const isStaticPage = await this.serveStaticFiles(req, res);
          if (isStaticPage) {
            return;
          }
          const route = this.router.getRoute(req.url, req.method);
          if (!route) {
            this.logger.logIfVerbose(
              `Route ${req.url} not Found`,
              this.isVerbose
            );
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
            `Path Variables: ${JSON.stringify(pathVariables)}`,
            this.isVerbose
          );

          const queryParams = this.router.getQueryParams(req.url);

          this.logger.logIfVerbose(
            `Query Params: ${JSON.stringify(queryParams)}`,
            this.isVerbose
          );

          this.handleRequest(req, res, route, pathVariables, queryParams);
        } catch (err: unknown) {
          this.logger.error(
            `An error happening when getting the route: ${
              (err as Error).message
            }`
          );

          this.errorResponse(res, err as Error);
        }
      }
    );

    this.httpServer = srvr;
  }

  listen(port?: number) {
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
      const publicDirectory = path.join(__dirname, `../${dir}`);
      const filePath = path.join(
        publicDirectory,
        req.url === "/" ? "index.html" : req.url || ""
      );
      this.logger.logIfVerbose(`Static File Path: ${filePath}`, this.isVerbose);
      const extname = String(path.extname(filePath)).toLowerCase();
      const contentType =
        fileTypes[extname as FILE_EXTENSIONS] || "application/octet-stream";
      try {
        const content = await readFile(filePath);
        this.response(res, 200, contentType, content);
        return true;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
          this.logger.logIfVerbose((error as Error).message, this.isVerbose);
        }
      }
    }
    return false;
  }

  response<T>(
    res: ServerResponse,
    status: number,
    contentType: string,
    message: T
  ) {
    res.writeHead(status, { "Content-Type": contentType });
    res.end(message);
  }

  private errorResponse(res: ServerResponse, err: Error) {
    this.response(
      res,
      500,
      "application/json",
      JSON.stringify({
        message: (err as Error).message || "Something went wrong",
      })
    );
  }
}

export default Server;
