import type IRouter from "./router.interface";

class Router implements IRouter {
  private routes: Route[] = [];
  private staticDirs: string[] = ["public"];

  constructor() {}

  public addRoute(
    url: string,
    method: METHODS[],
    callback: RouteCallback
  ): void {
    this.routes.push({
      url,
      method,
      callback,
    });
  }

  public addRoutes(routes: [Route]) {
    routes.forEach((route) => {
      this.addRoute(route.url, route.method, route.callback);
    });
  }

  public getRoute(
    url: string | undefined,
    method: string | undefined
  ): Route | null {
    if (!url || !method) {
      return null;
    }

    let route: Route | null = null;

    this.routes.map((rt: Route) => {
      const routeParts = rt.url.split("/").filter(Boolean);
      const urlParts = url.split("/").filter(Boolean);

      if (routeParts.length === urlParts.length) {
        const match = routeParts.every((part, index) => {
          return part.startsWith(":") || part === urlParts[index];
        });

        if (match) {
          route = rt;
        }
      }
    });

    return route;
  }

  public getPathVariables(
    reqUrl: string | undefined,
    routeUrl: string
  ): Record<string, string> {
    if (!reqUrl) return {};

    const routeParts = routeUrl.split("/").filter(Boolean);
    const urlParts = reqUrl.split("?")[0].split("/").filter(Boolean);

    const pathVariables: Record<string, string> = {};

    routeParts.forEach((part: string, index: number) => {
      if (part.startsWith(":")) {
        const key = part.slice(1);
        pathVariables[key] = urlParts[index];
      }
    });

    return pathVariables;
  }

  public getQueryParams(url: string | undefined): Record<string, string> {
    if (!url) return {};

    const queryParams: Record<string, string> = {};

    const queryString = url.split("?")[1];
    if (!queryString) return queryParams;

    const pairs = queryString.split("&");
    pairs.forEach((pair: string) => {
      const [key, value] = pair.split("=");
      queryParams[decodeURIComponent(key)] = decodeURIComponent(value);
    });

    return queryParams;
  }

  public addStaticDirectory(directory: string) {
    this.staticDirs.push(directory);
  }

  public addStaticDirectories(directories: string[]) {
    directories.forEach((dir) => {
      this.addStaticDirectory(dir);
    });
  }

  public getStaticDirs() {
    return this.staticDirs;
  }
}
export default Router;
