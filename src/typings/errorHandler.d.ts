import { ServerResponse } from "http";

declare global {
  type HandleErrorFunction = (res: ServerResponse, error: Error) => void;
  type SetCustomErrorHandlerFunction = (handler: CustomErrorHandler) => void;
}
