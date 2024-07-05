interface IRouter {
  addRoute: AddRouteFunction;
  addRoutes: AddRoutesFunction;
  getRoute: GetRouteFunction;
  getPathVariables: GetPathVariablesFunction;
  getQueryParams: GetQueryParamsFunction;
  addStaticDirectory: AddStaticDirectoryFunction;
  addStaticDirectories: AddStaticDirectoriesFunction;
  getStaticDirs: GetStaticDirsFunction;
}

export default IRouter;
