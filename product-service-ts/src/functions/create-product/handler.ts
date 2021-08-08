import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse, formatJSONResponse500, formatJSONResponse400 } from '../../libs/apiGateway';
import { middyfy } from '../../libs/lambda';
import schema from './schema';
import { Client } from 'pg';
import dbOptions from '../../pgConnetc';

export const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const { title, description, price, count } = event.body;

  console.log('Method: Post, function: Create product, Arguments: ' + Object.entries(event.body))

  if (!title || !description || !price || !count || !Number(price) || !Number(count) && !Number.isInteger(Number(count))) {
    return formatJSONResponse400({
      error: 'Bad requset'
    });
  }

  const client = new Client(dbOptions);
  try {
    client.connect();

    await client.query('BEGIN')
    const queryText = 'INSERT INTO products(title, description,price) VALUES($1,$2,$3) RETURNING id, title, description, price'
    const res = await client.query(queryText, [title, description, price])
    const insertPhotoText = 'INSERT INTO stocks(product_id, count) VALUES ($1, $2)'
    const insertPhotoValues = [res.rows[0].id, count]
    await client.query(insertPhotoText, insertPhotoValues)
    await client.query('COMMIT')

    return formatJSONResponse({
      log: 'product successfully created',
      product: res.rows[0]
    });
  } catch (err) {
    await client.query('ROLLBACK')
    console.log(err)
    return formatJSONResponse500({
      error: 'Filed to create product',
    });
  }
  finally {
    client.end();
  }
}

export const main = middyfy(createProduct);
