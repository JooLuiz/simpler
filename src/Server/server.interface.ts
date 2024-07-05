import { IncomingMessage, ServerResponse } from "http";

interface IServer {
  handleRequest: (
    req: IncomingMessage,
    res: ServerResponse,
    route: Route,
    pathVariables: Record<string, string>,
    queryParams: Record<string, string>
  ) => void;
  listen: (port: number) => void;
}

export default IServer;
