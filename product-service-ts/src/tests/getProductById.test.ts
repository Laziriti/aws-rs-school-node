import { product } from '../functions/get-product/handler';
import { listOfProducts } from '../assets/products';

describe('Get product by ID', () => {
    let eventMockWithId1 = {
        body: {},
        headers: null,
        multiValueHeaders: null,
        multiValueQueryStringParameters: null,
        httpMethod: 'get',
        path: null,
        pathParameters: { id: '1' },
        isBase64Encoded: null,
        queryStringParameters: null,
        stageVariables: null,
        requestContext: null,
        resource: null
    }
    let eventMockWithBadId = {
        body: {},
        headers: null,
        multiValueHeaders: null,
        multiValueQueryStringParameters: null,
        httpMethod: 'get',
        path: null,
        pathParameters: { id: 'asdasd' },
        isBase64Encoded: null,
        queryStringParameters: null,
        stageVariables: null,
        requestContext: null,
        resource: null
    }
    let eventMockWithNoExistId = {
        body: {},
        headers: null,
        multiValueHeaders: null,
        multiValueQueryStringParameters: null,
        httpMethod: 'get',
        path: null,
        pathParameters: { id: '11111' },
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

    it('Should return product by id', async () => {
        const func = product;
        let res = await func(eventMockWithId1, contestMock, () => { });
        console.log(res)
        expect(res).toEqual({ statusCode: 200, body: JSON.stringify({ product: listOfProducts[0] }) });
    })

    it('Should return Bad request', async () => {
        const func = product;
        let res = await func(eventMockWithBadId, contestMock, () => { });
        console.log(res)
        expect(res).toEqual({ statusCode: 400, body: JSON.stringify({ error: 'Bad request, id should be number' }) });
    })

    it('Should not find product with no exist id', async () => {
        const func = product;
        let res = await func(eventMockWithNoExistId, contestMock, () => { });
        console.log(res)
        expect(res).toEqual({ statusCode: 500, body: JSON.stringify({ error: 'There is no product with such id' }) });
    })
});
