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
    body: string,
    pathVariables: Record<string, string>,
    queryParams: Record<string, string>
  ) => void;

  type METHODS = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

  type AddRouteFunction = (
    url: string,
    method: METHODS[],
    callback: RouteCallback
  ) => void;

  type AddRoutesFunction = (routes: [Route]) => void;

  type GetRouteFunction = (
    url: string | undefined,
    method: string | undefined
  ) => Route | null;

  type GetPathVariablesFunction = (
    reqUrl: string | undefined,
    routeUrl: string
  ) => Record<string, string>;

  type GetQueryParamsFunction = (
    url: string | undefined
  ) => Record<string, string>;

  type AddStaticDirectoryFunction = (directory: string) => void;

  type AddStaticDirectoriesFunction = (directories: string[]) => void;

  type GetStaticDirsFunction = () => string[];
}
