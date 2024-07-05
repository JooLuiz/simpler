interface IServer {
  handleRequest: HandleRequestFunction;
  listen: ListenFunction;
  response: ResponseFunction;
}

export default IServer;
