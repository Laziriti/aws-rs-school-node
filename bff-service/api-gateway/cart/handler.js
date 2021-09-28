module.exports.cart = (event, context, cb) => {
    const appResponse = {
        api: 'cart',
        name: 'appCart'
    };

    const response = {
        statusCode: 200,
        body: JSON.stringify(appResponse)
    };
    cb(null, response);
}
