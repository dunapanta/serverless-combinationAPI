import { formatJSONResponse } from "@libs/apiGateway";
import { APIGatewayProxyEvent } from "aws-lambda";

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
