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
