# Cmbination API Clase 3

- Para el tipado de funciones
  `AWS["functions"]`
- En `serverless.ts` importo definición de funciones

# Combination API Clase 4 - Serverless Variables

- Por lo general se apunta a `self`, `aws` o `sls` con la sintaxis

* `${self:custom.urlTableName}` (reference custom section)
* `${sls:stage}-url-table`
* `${aws:accountId}`

# Combination API Clase 5 - Configure API Endpoints

- Definir handler

```
import { APIGatewayProxyEvent } from "aws-lambda";

export const handler = async (event: APIGatewayProxyEvent) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello Serverless!",
      path: event.path,
    }),
  };
};
```

- Agregarlo en `functions.ts`

```
combinationAPI: {
    handler: "src/functions/combinationAPI/index.handler",
  },
```

- Define API Gateway config to trigger the function `functions.ts`

```
combinationAPI: {
    handler: "src/functions/combinationAPI/index.handler",
    events: [
      {
        httpApi: {
          path: "/gameDeals",
          method: "get",
        },
      },
    ],
  },
```
- Para desplegarlo en `serverless.ts`, (si el usuario no esta configurado por defecto) en `provider` se agrega
```
profile: "serverlessUser",
```
- Tambien en `provider` se agrega la región (por defecto es us-east-1)
```
region: "us-east-1",
```