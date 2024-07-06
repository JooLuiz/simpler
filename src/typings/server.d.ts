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
    headers: Record<string, string>,
    content: T
  ) => void;

  type LoadFileFunction = (res: ServerResponse, urlFile: string) => void;
  type RedirectFunction = (res: ServerResponse, location: string) => void;
}
