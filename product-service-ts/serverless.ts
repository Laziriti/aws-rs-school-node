import type { AWS } from '@serverless/typescript';

import getAllProducts from '@functions/get-all-products';
import getProduct from '@functions/get-product';
import createProduct from '@functions/create-product';
import catalogBatchProcess from '@functions/catalog-batch-process';

const serverlessConfiguration: AWS = {
  service: 'product-service-ts',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  resources: {
    Resources:
    {
      catalogItemsQueue:
      {
        Type: 'AWS::SQS::Queue',
        Properties:
          { QueueName: 'catalogItemsQueue' }
      },
      createProductTopic:
      {
        Type: 'AWS::SNS::Topic',
        Properties:
          { TopicName: 'createProductTopic' }
      },
      primarySubscription:
      {
        Type: 'AWS::SNS::Subscription',
        Properties:
        {
          Endpoint: 'vadim-shut@mail.ru',
          TopicArn: { Ref: 'createProductTopic' },
          Protocol: 'email',
        }
      }
    }
  },
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
          { Effect: "Allow", Action: "sns:*", Resource: "arn:aws:sns:eu-west-1:880377123414:createProductTopic" }
        ],
      }
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      PG_HOST: '',
      PG_PORT: '',
      PG_DATABASE: '',
      PG_USERNAME: '',
      PG_PASSWORD: ''
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { getAllProducts, getProduct, createProduct, catalogBatchProcess },
};

module.exports = serverlessConfiguration;
