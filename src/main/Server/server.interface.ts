interface IServer {
  handleRequest: HandleRequestFunction;
  listen: ListenFunction;
  response: ResponseFunction;
  loadFile: LoadFileFunction;
  redirect: RedirectFunction;
}

export default IServer;
