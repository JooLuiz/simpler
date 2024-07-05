import http, { IncomingMessage, ServerResponse } from "http";
import type IServer from "./server.interface";
import type IRouter from "../Router/router.interface";
import type ILogger from "../Logger/logger.interface";
import Router from "../Router";
import Logger from "../Logger";

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
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: (err as Error).message || "Something went wrong",
          })
        );
      }
    });
  }

  private createServer() {
    const srvr = http.createServer(
      async (req: IncomingMessage, res: ServerResponse) => {
        try {
          const route = this.router.getRoute(req.url, req.method);
          if (!route) {
            this.logger.logIfVerbose(
              `Route ${req.url} not Found`,
              this.isVerbose
            );
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Route Not Found" }));
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

          const queryParams = this.router.getqueryParams(req.url);

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

          res.writeHead(500, { "Content-Type": "application/json" });

          res.end(
            JSON.stringify({
              message: (err as Error).message || "Something went wrong",
            })
          );
        }
      }
    );

    this.httpServer = srvr;
  }

  listen(port: number) {
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
}

export default Server;
