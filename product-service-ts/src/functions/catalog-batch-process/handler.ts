import 'source-map-support/register';

import { formatJSONResponse, formatJSONResponse500, formatJSONResponse400 } from '../../libs/apiGateway';
import { middyfy } from '../../libs/lambda';
import { Client } from 'pg';
import dbOptions from '../../pgConnetc';
import { SNS } from 'aws-sdk';

export const catalogBatchProcess: any = async (event) => {
  const client = new Client(dbOptions);
  client.connect();
  const sns = new SNS({ region: 'eu-west-1' });
  const resultProducts = [];
  try {
    for await (const record of event.Records) {
      const product = JSON.parse(record.body);
      const { title, description } = product;
      const price = Number(product.price);
      const count = Number(product.count);
      console.log(product)
      if (!title || !description || !price || !count || !Number(price) || !Number(count) && !Number.isInteger(Number(count))) {
        return formatJSONResponse400({
          error: 'Bad requset'
        });
      }
      await client.query('BEGIN')
      const queryText = 'INSERT INTO products(title, description,price) VALUES($1,$2,$3) RETURNING id, title, description, price'
      const res = await client.query(queryText, [title, description, price])
      const insertPhotoText = 'INSERT INTO stocks(product_id, count) VALUES ($1, $2)'
      const insertPhotoValues = [res.rows[0].id, count]
      await client.query(insertPhotoText, insertPhotoValues)
      await client.query('COMMIT')
      resultProducts.push(product);
    }
    await sns.publish({
      Subject: 'AWS Notification',
      Message: JSON.stringify(resultProducts),
      TopicArn: 'arn:aws:sns:eu-west-1:880377123414:createProductTopic'
    }).promise();
    return formatJSONResponse({
      log: 'products successfully created',
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

export const main = middyfy(catalogBatchProcess);
