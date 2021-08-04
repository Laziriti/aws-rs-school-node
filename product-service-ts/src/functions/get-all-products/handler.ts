import 'source-map-support/register';
import { Client } from 'pg';
import dbOptions from '../../pgConnetc';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse, formatJSONResponse500 } from '../../libs/apiGateway';
import { middyfy } from '../../libs/lambda';
import schema from './schema';

export const products: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  console.log('Method: Get, function: Get all products, No arguments')
  const client = new Client(dbOptions);
  try {
    await client.connect();
    const { rows: products } =
      await client.query('SELECT products.id, products.title, products.description, products.price, s.count' +
        ' FROM products' +
        ' join stocks as s on public.products.id = s.product_id');
    return formatJSONResponse(products);
  } catch (err) {
    console.log(err);
    return formatJSONResponse500({
      error: 'Failed to get products'
    });
  }
  finally {
    client.end();
  }
}

export const main = middyfy(products);
