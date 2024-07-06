# Simpler

![Node.js](https://img.shields.io/badge/Node.js-v14.17.3-green)
![License](https://img.shields.io/badge/license-MIT-blue)

Simpler é um framework de servidor Node.js leve e personalizável. Ele permite definir rotas, lidar com variáveis de caminho dinâmicas, parâmetros de consulta e servir arquivos estáticos com facilidade.

## Instalação

Para instalar o Simpler, você pode usar o npm:

```bash
npm install simpler
```

## Uso

### Criando uma Instância

Você pode criar uma instância do Simpler importando-o e, opcionalmente, habilitando logs verbosos:

```typescript
import Simpler from "simpler";

const simpler = new Simpler(true); // Habilitar logs verbosos
```

### Definindo Rotas

Você pode definir rotas usando os métodos `addRoute` ou `addRoutes`. A mesma rota pode lidar com múltiplos métodos, e você pode definir variáveis de caminho dinâmicas usando `:`. A função de callback para uma rota sempre receberá `req`, `res`, `body`, `pathVariables` e `queryParams`.

`pathVariables` e `queryParams` são objetos com os valores dos parâmetros de caminho e de consulta.

Simpler possui um método de resposta que executará os métodos de resposta padrão. Você pode definir uma resposta via Simpler ou diretamente em `res`. Abaixo estão alguns exemplos e seus equivalentes:

```typescript
// Retornando com Simpler
simpler.response(res, 200, "application/json", JSON.stringify(parsedBody));

// Equivalente retornando diretamente com res
res.writeHead(200, { "Content-Type": "application/json" });
res.end(JSON.stringify(parsedBody));

// Retornando com Simpler
simpler.response(res, 200, "text/html", data);

// Equivalente retornando diretamente com res
res.writeHead(200, { "Content-Type": "text/html" });
res.end(data);
```

Abaixo, você encontrará exemplos de como usar o método `addRoute`.

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
      Exemplo de variáveis de caminho:
      pathVariables: {
      "id": "{valor}"
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
      Exemplo de variáveis de caminho:
      pathVariables: {
      "id": "{valor1}",
      "xpto": "{valor2}",
      }
    */
    simpler.response(res, 200, "application/json", JSON.stringify(parsedBody));
    return;
  }
);
```

### Servindo Arquivos Estáticos

Você pode configurar o Simpler para servir arquivos estáticos de um diretório usando os métodos `addStaticDirectory` ou `addStaticDirectories`. Além disso, você pode carregar uma página HTML em uma rota.

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

### Carregando arquivos

Você pode carregar arquivos com simpler utilizando a função `loadFile`, a função recebe um res a o caminho relativo para o arquivo.

Abaixo você encontrará um exemplo de como utilizar-la.

```typescript
simpler.router.addRoute("/static-page", ["GET"], (_req, res) => {
  simpler.loadFile(res, "./src/static/teste.html");
});
```

### Lidando com Erros

Você pode lidar com erros de maneira customizada utilizando a função `errorHandler.setCustomErrorHandler`. A função recebe uma função como parâmetro que receberá res e error como parâmetros.

Abaixo você encontrará um exemplo de como utilizar-la.

```typescript
simpler.errorHandler.setCustomErrorHandler(
  (res: ServerResponse, error: Error) => {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Custom Error", error: error.message }));
  }
);
```


### Iniciando o Servidor

Para iniciar o servidor, use o método `listen`. Você pode especificar o número da porta, que por padrão é 3000 se não for fornecido.

```typescript
simpler.listen(3001);
```

### Exemplo de Implementação

Aqui está um exemplo de uma configuração completa usando Simpler:

```typescript
import { readFile } from "fs";
import Simpler from "simpler";
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

Seguindo estas instruções, você pode configurar e executar seu servidor Simpler, configurar rotas, lidar com variáveis de caminho dinâmicas, parâmetros de consulta e servir arquivos estáticos com facilidade.

## Licença

Este projeto é licenciado sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

# Outras versões

[Readme em Inglês (EN)](README.md)