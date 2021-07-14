import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse, formatJSONResponse500, formatJSONResponse400, formatJSONResponse404 } from '../../libs/apiGateway';
import { middyfy } from '../../libs/lambda';
import { listOfProducts } from '../../assets/products';
import schema from './schema';

export const product: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    if (!Number(event.pathParameters.id)) {
      return formatJSONResponse400({
        error: 'Bad request, id should be number'
      });
    }

    const product = await getProductById(event.pathParameters.id);

    if (product) {
      return formatJSONResponse({
        product
      });
    } else {
      return formatJSONResponse404({
        error: 'There is no product with such id'
      });
    }
  } catch (err) {
    return formatJSONResponse500({
      error: 'Filed to get product'
    });
  }
}

async function getProductById(id: string) {
  const result = listOfProducts.find(product => product.id === id)
  return result;
}

export const main = middyfy(product);
