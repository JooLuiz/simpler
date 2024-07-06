interface IServer {
  handleRequest: HandleRequestFunction;
  listen: ListenFunction;
  response: ResponseFunction;
  loadFile: LoadFileFunction;
}

export default IServer;
