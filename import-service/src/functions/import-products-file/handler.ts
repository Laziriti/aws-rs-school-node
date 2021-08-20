import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse, formatJSONResponse500, formatJSONResponse400 } from '../../libs/apiGateway';
import { middyfy } from '../../libs/lambda';
import schema from './schema';
import AWS from 'aws-sdk';
export const importProductFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const fileName = event.queryStringParameters.name;

  if (!fileName || typeof fileName !== "string") {
    return formatJSONResponse400({
      error: 'Bad requset'
    });
  }
  try {
    const s3 = new AWS.S3({ region: 'eu-west-1', signatureVersion: "v4" })

    const s3SignedUrl = await s3.getSignedUrlPromise('putObject', {
      Bucket: process.env.s3BucketName,
      Key: `uploaded/${fileName}`,
    });

    return formatJSONResponse(s3SignedUrl);
  } catch (err) {
    console.log(err)
    return formatJSONResponse500({
      error: 'Filed to import file',
    });
  }
  finally {
  }
}

export const main = middyfy(importProductFile);
