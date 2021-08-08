import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse, formatJSONResponse500, formatJSONResponse404 } from '../../libs/apiGateway';
import { middyfy } from '../../libs/lambda';
import schema from './schema';
import { Client } from 'pg';
import dbOptions from '../../pgConnetc';

export const product: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log('Method: Get, function: Get product by id, Arguments: ' + Object.entries(event.pathParameters))
  const client = new Client(dbOptions);
  try {
    await client.connect();
    const { rows: product } =
      await client.query('SELECT products.id, products.title, products.description, products.price, s.count' +
        ' FROM products' +
        ' join stocks as s on public.products.id = s.product_id' +
        ' where products.id = $1', [event.pathParameters.id]);

    if (product) {
      return formatJSONResponse({
        ...product[0]
      });
    } else {
      return formatJSONResponse404({
        error: 'There is no product with such id'
      });
    }
  } catch (err) {
    console.log(err)
    return formatJSONResponse500({
      error: 'Filed to get product'
    });
  }
  finally {
    client.end();
  }
}

export const main = middyfy(product);
