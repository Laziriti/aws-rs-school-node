import type { AWS } from '@serverless/typescript';

import importProductFile from '@functions/import-products-file';
import importFileParser from '@functions/import-file-parser';

const serverlessConfiguration: AWS = {
  service: 'file-service-ts',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: 'dev',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iam: {
      role: {
        statements: [
          { Effect: "Allow", Action: "s3:ListBucket", Resource: "arn:aws:s3:::import-products-files-bucket" },
          { Effect: "Allow", Action: "s3:*", Resource: "arn:aws:s3:::import-products-files-bucket" },
          { Effect: "Allow", Action: "s3:*", Resource: "arn:aws:s3:::import-products-files-bucket/*" },
          { Effect: "Allow", Action: "s3:*", Resource: "arn:aws:s3:::import-products-files-bucket/*/*" },
          { Effect: "Allow", Action: "sqs:*", Resource: "arn:aws:sqs:eu-west-1:880377123414:catalogItemsQueue" }
        ],
      }
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      s3BucketName: 'import-products-files-bucket'
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { importProductFile, importFileParser },
};

module.exports = serverlessConfiguration;
