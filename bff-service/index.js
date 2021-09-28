const express = require('express');
require('dotenv').config();
const axios = require('axios').default;
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const app = express();
const PORT = process.env.PORT || 3001;

app.all('/*', jsonParser, (req, res) => {
    const recipient = req.originalUrl.split('/')[1];

    const recipientURL = process.env[recipient];

    if (recipientURL) {
        const axiosConfig = {
            method: req.method,
            url: `${recipientURL}`,
            ...(Object.keys(req.body || {}).length > 0 && { data: req.body })
        };
        axios(axiosConfig)
            .then(function (response) {
                res.json(response.data);
            })
            .catch(error => {
                if (error.response) {
                    const {
                        status,
                        data
                    } = error.response;
                    res.status(status).json(data);
                } else {
                    res.status(500).json({ error: error.message });
                };
            });
    } else {
        res.status(502).json({ error: 'Cannot process request' });
    }
})

app.listen(PORT, () => {
    console.log(`STARTED at PORT: ${PORT}`);
});
