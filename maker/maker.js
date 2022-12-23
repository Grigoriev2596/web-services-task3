const express = require('express');
const dotenv = require('../node_modules/dotenv').config({path: '../.env'}).parsed;
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

app.use(bodyParser.json());

const ordersService = `http://localhost:${dotenv.ORDER_PORT}`;

const makers = [
    {
        id: 1,
        name: 'Maker 1',
        furnitures: [],
    },
    {
        id: 2,
        name: 'Maker 2',
        furnitures: [],
    },
    {
        id: 3,
        name: 'Maker 3',
        furnitures: [],
    },
];

app.get('/makers', (req, res) => {
    console.log('Returning makers list');
    res.send(makers);
});

app.post('/createMakerOrder', (req, res) => {
    if (!req.body.makerId || !req.body.orderId) {
        res.status(400).send({ problem: 'Invalid body' });
        return;
    }
    request.post({
        headers: { 'content-type': 'application/json' },
        url: `${ordersService}/maker/${req.body.orderId}`,
        body: JSON.stringify({
            makerId: req.body.makerId,
            makerName: makers.find(maker => maker.id === +req.body.makerId).name
        })
    }, (err, response, body) => {
        if (!err) {
            const makerId = parseInt(req.body.makerId);
            const maker = makers.find(furniture => furniture.id === makerId);
            const body = req.body;
            if ('furnitures' in body && Array.isArray(body.furnitures)) {
                const furnitures = body.furnitures
                    .filter((furniture) => furniture)
                    .map((furniture) => furniture.toLowerCase());
                maker.furnitures = Array.from(new Set([...maker.furnitures, ...furnitures]));
                res.status(202).send(maker);
            } else {
                res.status(400).send({ problem: 'Furnitures should be array' });
            }
        } else {
            res.status(400).send({ problem: err });
        }
    });
});

app.listen(
    dotenv.MAKER_PORT,
    () => console.log(`Maker listening on port ${dotenv.MAKER_PORT}`)
);

