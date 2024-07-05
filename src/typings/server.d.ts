import { IncomingMessage, ServerResponse } from "http";

declare global {
  type HandleRequestFunction = (
    req: IncomingMessage,
    res: ServerResponse,
    route: Route,
    pathVariables: Record<string, string>,
    queryParams: Record<string, string>
  ) => void;

  type ListenFunction = (
    port?: number
  ) =>
    | http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
    | undefined;

  type ResponseFunction = (
    res: ServerResponse,
    status: number,
    contentType: string,
    message: T
  ) => void;
}
