import { formatJSONResponse } from "@libs/apiGateway";
import { APIGatewayProxyEvent } from "aws-lambda";
import Axios from "axios";

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
