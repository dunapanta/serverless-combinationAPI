type Response = { statusCode?: number; data?: any };

export const formatJSONResponse = ({
  statusCode = 200,
  data = {},
}: Response) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(data),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
  };
};
