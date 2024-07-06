interface IErrorHandler {
  handleError: HandleErrorFunction;
  setCustomErrorHandler: SetCustomErrorHandlerFunction;
}

export default IErrorHandler;
