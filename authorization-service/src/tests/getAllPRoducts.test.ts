import { products } from '../functions/get-all-products/handler';
import { listOfProducts } from '../assets/products';
import { corsHeaders } from "../cors-headers";

describe('Get all products', () => {
    const eventMock = {} as any;
    const contestMock = {} as any;
    it('Should return list of products', async () => {
        const res = await products(eventMock, contestMock, () => { });
        expect(res).toEqual({ statusCode: 200, headers: corsHeaders, body: JSON.stringify(listOfProducts) });
    })
});
