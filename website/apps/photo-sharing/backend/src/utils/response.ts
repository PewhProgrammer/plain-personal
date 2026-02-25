import { APIGatewayProxyResultV2 } from "aws-lambda";

export function success<T>(data: T, statusCode: number = 200): APIGatewayProxyResultV2 {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(data),
  };
}

export function error(
  message: string,
  statusCode: number = 500
): APIGatewayProxyResultV2 {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      error: statusCode >= 500 ? "Internal Server Error" : "Bad Request",
      message,
      statusCode,
    }),
  };
}
