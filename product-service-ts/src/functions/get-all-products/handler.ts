import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse, formatJSONResponse500 } from '../../libs/apiGateway';
import { middyfy } from '../../libs/lambda';
import { listOfProducts } from '../../assets/products';
import schema from './schema';

export const products: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  try {
    const result = await getAllProduct();
    return formatJSONResponse(result);
  } catch (err) {
    return formatJSONResponse500({
      error: 'Some error on the server side'
    });
  }
}

async function getAllProduct() {
  return listOfProducts;
}

export const main = middyfy(products);
