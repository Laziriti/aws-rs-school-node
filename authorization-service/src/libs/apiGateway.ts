import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";
import { corsHeaders } from "../cors-headers"

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const formatJSONResponse = (response: Record<any, unknown> | Array<unknown> | string) => {
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify(response)
  };
};

export const formatJSONResponse500 = (response: Record<string, unknown>) => {
  return {
    statusCode: 500,
    headers: corsHeaders,
    body: JSON.stringify(response)
  };
};

export const formatJSONResponse400 = (response: Record<string, unknown>) => {
  return {
    statusCode: 400,
    headers: corsHeaders,
    body: JSON.stringify(response)
  };
};

export const formatJSONResponse404 = (response: Record<string, unknown>) => {
  return {
    statusCode: 404,
    headers: corsHeaders,
    body: JSON.stringify(response)
  };
};

