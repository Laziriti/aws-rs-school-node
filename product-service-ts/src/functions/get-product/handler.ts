import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse, formatJSONResponse500, formatJSONResponse400 } from '../../libs/apiGateway';
import { middyfy } from '../../libs/lambda';
import { listOfProducts } from '../../assets/products';
import schema from './schema';

export const product: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const product = await getProductById(event.pathParameters.id);
    if (!Number(event.pathParameters.id)) {
      return formatJSONResponse400({
        error: 'Bad request, id should be number'
      });
    }
    if (product) {
      return formatJSONResponse({
        product
      });
    } else {
      return formatJSONResponse500({
        error: 'There is no product with such id'
      });
    }
  } catch (err) {
    return formatJSONResponse500({
      error: 'Some error on the server side'
    });
  }
}

async function getProductById(id: string) {
  const result = listOfProducts.find(product => product.id === id)
  return result;
}

export const main = middyfy(product);
