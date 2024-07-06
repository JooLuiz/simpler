# Simpler Server

![Node.js](https://img.shields.io/badge/Node.js-v14.17.3-green)
![License](https://img.shields.io/badge/license-MIT-blue)

Simpler is a lightweight, customizable Node.js server framework. It allows you to define routes, handle dynamic path variables, query parameters, and serve static files with ease.

## Installation

To install Simpler, you can use npm:

```bash
npm install simpler-server
```

## Usage

### Creating an Instance

You can create an instance of Simpler by importing it and optionally enabling verbose logging:

```typescript
import Simpler from "simpler-server";

const simpler = new Simpler(true); // Enable verbose logging
```

### Defining Routes

You can define routes using the `addRoute` or the `addRoutes` methods. The same route can handle multiple methods, and you can define dynamic path variables using `:`. The callback function for a route will always receive `req`, `res`, `body`, `pathVariables`, and `queryParams`.

pathVariables and queryParams are the objects with the values of the path parameters and query parameters.

Simpler has a response method that will run the default response methods, you can either set a response via simpler or directly in res, below are some examples and their equivalent:

```typescript
//Returning with simpler
simpler.response(res, 200, "application/json", JSON.stringify(parsedBody));

//Equivalent returning directly with res
res.writeHead(200, { "Content-Type": "application/json" });
res.end(JSON.stringify(parsedBody));

//Returning with simpler
simpler.response(res, 200, "text/html", data);

//Equivalent returning directly with res
res.writeHead(200, { "Content-Type": "text/html" });
res.end(data);
```

Below you'll find examples on how to use the `addRoute` method.

```typescript
simpler.router.addRoute(
  "/test",
  ["POST", "GET"],
  (_req, res, body, _pathVariables, _queryParams) => {
    const parsedBody = JSON.parse(body);
    simpler.response(res, 200, "application/json", JSON.stringify(parsedBody));
    return;
  }
);

simpler.router.addRoute(
  "/test/:id",
  ["POST", "GET"],
  (_req, res, body, _pathVariables, _queryParams) => {
    const parsedBody = JSON.parse(body);
    /*
      Path variables example:
      pathVariables: {
      "id": "{value}"
      }
    */
    simpler.response(res, 200, "application/json", JSON.stringify(parsedBody));
    return;
  }
);

simpler.router.addRoute(
  "/test/:id/:xpto",
  ["POST", "GET"],
  (_req, res, body, _pathVariables, _queryParams) => {
    const parsedBody = JSON.parse(body);
    /*
      Path variables example:
      pathVariables: {
      "id": "{value1}",
      "xpto": "{value2}",
      }
    */
    simpler.response(res, 200, "application/json", JSON.stringify(parsedBody));
    return;
  }
);
```

### Serving Static Files

You can configure Simpler to serve static files from a directory using the `addStaticDirectory` or `addStaticDirectories` methods. Additionally, you can load an HTML page in a route.

```typescript
import path from "path";
import { readFile } from "fs";

simpler.router.addStaticDirectory("./src/static");

simpler.router.addRoute("/static", ["GET"], (_req, res) => {
  const testePath = path.join(__dirname, "static", "test.html");
  readFile(testePath, (err, data) => {
    if (err) {
      simpler.response(res, 500, "text/plain", "500 Internal Server Error");
      return;
    }

    simpler.response(res, 200, "text/html", data);
  });
});
```

### Loading Files

You can load files with simpler with the function `loadFile`, it receives a res and the relative path to the file.

Below you'll find an example of how to use it.

```typescript
simpler.router.addRoute("/static-page", ["GET"], (_req, res) => {
  simpler.loadFile(res, "./src/static/teste.html");
});
```

### Handling errors

You can have custom error handlers using the function `errorHandler.setCustomErrorHandler`. It receives a function that will have a res and an error as parameters.

Below you'll find an example of how to use it.

```typescript
simpler.errorHandler.setCustomErrorHandler(
  (res: ServerResponse, error: Error) => {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Custom Error", error: error.message }));
  }
);
```

### Starting the Server

To start the server, use the `listen` method. You can specify the port number, which defaults to 3000 if not provided.

```typescript
simpler.listen(3001);
```

### Implementation Example

Here is an example of a full setup using Simpler:

```typescript
import { readFile } from "fs";
import Simpler from "simpler-server";
import path from "path";

const simpler = new Simpler(true);

simpler.router.addRoute("/test", ["POST", "GET"], (_req, res, body) => {
  const parsedBody = JSON.parse(body);
  simpler.response(res, 200, "application/json", JSON.stringify(parsedBody));
  return;
});

simpler.router.addRoute(
  "/test/:id",
  ["POST", "GET"],
  (_req, res, body: string, _pathVariables, _queryParams) => {
    const parsedBody = JSON.parse(body);
    simpler.response(res, 200, "application/json", JSON.stringify(parsedBody));
    return;
  }
);

simpler.router.addRoute(
  "/test/:id/:xpto",
  ["POST", "GET"],
  (_req, res, body, _pathVariables, _queryParams) => {
    const parsedBody = JSON.parse(body);
    simpler.response(res, 200, "application/json", JSON.stringify(parsedBody));
    return;
  }
);

simpler.router.addStaticDirectory("./src/static");

simpler.router.addRoute("/static-page", ["GET"], (_req, res) => {
  simpler.loadFile(res, "./src/static/teste.html");
});

simpler.errorHandler.setCustomErrorHandler(
  (res: ServerResponse, error: Error) => {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Custom Error", error: error.message }));
  }
);

simpler.listen(3001);
```

By following these instructions, you can set up and run your Simpler server, configure routes, handle dynamic path variables, query parameters, and serve static files with ease.

## License

This project is licensed under the MID license. Check file [LICENSE](LICENSE) for more details.

# Other versions

[Readme in Portuguese (PT-BR)](README.pt-br.md)
