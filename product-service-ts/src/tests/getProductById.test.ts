import { product } from '../functions/get-product/handler';
import { listOfProducts } from '../assets/products';
import { corsHeaders } from "../cors-headers";

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
        let test = {...eventMockWithId1, pathParameters: { id: '2' }}
        const res = await product(test, contestMock, () => { });
        expect(res).toEqual({ statusCode: 200, headers: corsHeaders, body: JSON.stringify({ product: listOfProducts[1] }) });
    })

    it('Should return Bad request', async () => {
        const res = await product(eventMockWithBadId, contestMock, () => { });
        expect(res).toEqual({ statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Bad request, id should be number' }) });
    })

    it('Should not find product with no exist id', async () => {
        const res = await product(eventMockWithNoExistId, contestMock, () => { });
        console.log(res)
        expect(res).toEqual({ statusCode: 404, headers: corsHeaders, body: JSON.stringify({ error: 'There is no product with such id' }) });
    })
});
