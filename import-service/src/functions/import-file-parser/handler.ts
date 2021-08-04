import 'source-map-support/register';

import { formatJSONResponse, formatJSONResponse500 } from '../../libs/apiGateway';
import { middyfy } from '../../libs/lambda';
import AWS from 'aws-sdk';
import csv from 'csv-parser';

export const importFileParser: any = async (event) => {

  try {
    const s3 = new AWS.S3({ region: 'eu-west-1', signatureVersion: "v4" })

    s3.getObject()
    for (const record of event.Records) {
      const results = [];
      await s3.getObject({
        Bucket: process.env.s3BucketName,
        Key: record.s3.object.key
      }).createReadStream()
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          console.log(results);
        });
        console.log(process.env.s3BucketName + '/' + record.s3.object.key)
        console.log(record.s3.object.key.replace('uploaded', 'parsed'))
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

export const main = middyfy(importFileParser);
