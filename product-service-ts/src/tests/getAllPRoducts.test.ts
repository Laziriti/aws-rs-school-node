import { products } from '../functions/get-all-products/handler';
import { listOfProducts } from '../assets/products';

describe('Get all products', () => {
    let eventMock = {
        body: {},
        headers: null,
        multiValueHeaders: null,
        multiValueQueryStringParameters: null,
        httpMethod: 'get',
        path: null,
        pathParameters: null,
        isBase64Encoded: null,
        queryStringParameters: null,
        stageVariables: null,
        requestContext: null,
        resource: null
    }
    let contestMock = {
        callbackWaitsForEmptyEventLoop: null,
        functionName: null,
        functionVersion: null,
        invokedFunctionArn: null,
        memoryLimitInMB: null,
        awsRequestId: null,
        logGroupName: null,
        logStreamName: null,
        getRemainingTimeInMillis: null,
        done: null,
        fail: null,
        succeed: null
    };
    it('Should return list of products', async () => {
        const func = products;
        let res = await func(eventMock, contestMock, () => { });
        console.log(res)
        expect(res).toEqual({ statusCode: 200, body: JSON.stringify({ products: listOfProducts }) });
    })
});
