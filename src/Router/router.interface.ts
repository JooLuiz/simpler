interface IRouter {
  addRoute: (url: string, method: METHODS[], callback: RouteCallback) => void;
  addRoutes: (routes: [Route]) => void;
  getRoute: (
    url: string | undefined,
    method: string | undefined
  ) => Route | null;
  getPathVariables: (
    reqUrl: string | undefined,
    routeUrl: string
  ) => Record<string, string>;
  getqueryParams: (url: string | undefined) => Record<string, string>;
}

export default IRouter;
