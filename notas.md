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

# Combination API Clase 6 - Function Lambda

- Se crea función `apiGateway.ts` para definir las respuestas
- Se define código de Lambda

```
export const handler = async (event: APIGatewayProxyEvent) => {
  const { queryStringParameters = {} } = event;

  const { currency } = queryStringParameters;

  if (!currency) {
    return formatJSONResponse({
      statusCode: 400,
      data: { message: "Missing currency parameter" },
    });
  }

  return formatJSONResponse({ data: { message: "Success" } });
};
```
# Combination API Clase 7 - Lambda final code
```
export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const { queryStringParameters = {} } = event;

    const { currency } = queryStringParameters;

    if (!currency) {
      return formatJSONResponse({
        statusCode: 400,
        data: { message: "Missing currency parameter" },
      });
    }

    //get deals from api
    const deals = await Axios.get(
      "https://www.cheapshark.com/api/1.0/deals?upperPrice=15&pageSize=5"
    );

    //get currency
    const currencyData = await Axios.get(
      `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd/${currency}.json`
    );
    const currencyConversion = currencyData.data[currency];

    const repriceDeals = deals.data.map((deal: any) => {
      const {
        title,
        storeID,
        salePrice,
        normalPrice,
        savings,
        steamRatingPercent,
        releaseDate,
      } = deal;

      return {
        title,
        storeID,
        steamRatingPercent,
        salePrice: (salePrice * currencyConversion).toFixed(2),
        normalPrice: (normalPrice * currencyConversion).toFixed(2),
        savings: (savings * currencyConversion).toFixed(2),
        releaseDate: new Date(releaseDate * 1000).toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      };
    });

    return formatJSONResponse({ data: repriceDeals });
  } catch (err) {
    console.log("Error:", err);
    return formatJSONResponse({
      statusCode: 500,
      data: { message: "Internal Server Error" },
    });
  }
};

```
