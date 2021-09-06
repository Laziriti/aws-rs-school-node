import 'source-map-support/register';

import { formatJSONResponse, formatJSONResponse500 } from '../../libs/apiGateway';
import { middyfy } from '../../libs/lambda';
import AWS from 'aws-sdk';
import csv from 'csv-parser';

export const importFileParser: any = async (event) => {

  try {
    const s3 = new AWS.S3({ region: 'eu-west-1', signatureVersion: "v4" })
    const SQS = new AWS.SQS();
    const products: any[] = await createProducts(s3, SQS, event.Records);
    for await (const product of products[0]) {
      const sqsResult = await SQS.sendMessage({
        QueueUrl: 'https://sqs.eu-west-1.amazonaws.com/880377123414/catalogItemsQueue',
        MessageBody: JSON.stringify(product)
      }).promise();
      console.log(sqsResult);
    }
    console.log(products);
    await moveRecords(s3, event.Records);

    return formatJSONResponse({ msg: 'All ok' });
  } catch (err) {
    console.log(err)
    return formatJSONResponse500({
      error: 'Filed to parse file',
    });
  }
  finally {
  }
}

const moveRecords = async (s3, records) => {
  for await (const record of records) {
    await s3.copyObject({
      Bucket: process.env.s3BucketName,
      CopySource: process.env.s3BucketName + '/' + record.s3.object.key,
      Key: record.s3.object.key.replace('uploaded', 'parsed')
    })
    await s3.deleteObject({
      Bucket: process.env.s3BucketName,
      Key: record.s3.object.key
    })
  }
}

const createProducts = (s3, SQS, records) => {
  const promises = records.map((record) => {
    const params = {
      Bucket: record.s3.bucket.name,
      Key: record.s3.object.key,
    }

    const readStream = s3.getObject(params).createReadStream()

    const allRowsData = []
    return new Promise((resolve, reject) => {
      readStream
        .pipe(csv())
        .on("data", (data) => {
          allRowsData.push(data);
        })
        .on("end", () => {
          resolve(allRowsData)
        })
        .on("error", (error) => {
          reject(error)
        })
    })
  })

  return Promise.all(promises)
}

export const main = middyfy(importFileParser);
