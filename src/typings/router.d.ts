import { IncomingMessage, ServerResponse } from "http";

declare global {
  interface Route {
    url: string;
    method: METHODS[];
    callback: RouteCallback;
  }

  type RouteCallback = (
    req: IncomingMessage,
    res: ServerResponse,
    body: T,
    pathVariables: Record<string, string>,
    queryParams: Record<string, string>
  ) => void;

  type METHODS = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
}
