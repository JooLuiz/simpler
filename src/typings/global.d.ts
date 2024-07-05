import Server from "../main/Server";

declare global {
  type FILE_EXTENSIONS =
    | ".html"
    | ".js"
    | ".css"
    | ".json"
    | ".png"
    | ".jpg"
    | ".gif"
    | ".wav"
    | ".mp4"
    | ".woff"
    | ".ttf"
    | ".eot"
    | ".otf"
    | ".svg";

  type Simpler = Server;
}
