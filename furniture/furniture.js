const express = require('express');
const dotenv = require('../node_modules/dotenv').config({path: '../.env'}).parsed;
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

app.use(bodyParser.json());

const ordersService = `http://localhost:${dotenv.ORDER_PORT}`;

const furnitures = [
    {
        id: 1,
        name: 'chair',
        amount: 0,
    },
    {
        id: 2,
        name: 'sofa',
        amount: 0,
    },
    {
        id: 3,
        name: 'table',
        amount: 0,
    },
];

app.get('/furnitures', (req, res) => {
    console.log('Returning furnitures list');
    res.send(furnitures);
});

app.post('/createFurnitureOrder', (req, res) => {
    if (!req.body.furnitureId || !req.body.orderId) {
        res.status(400).send({ problem: 'Invalid body' });
        return;
    }
    request.post({
        headers: { 'content-type': 'application/json' },
        url: `${ordersService}/furniture/${req.body.orderId}`,
        body: JSON.stringify({
            furnitureId: req.body.furnitureId,
            furnitureName: furnitures.find(furniture => furniture.id === +req.body.furnitureId).name
        })
    }, (err, response, body) => {
        if (!err) {
            const furnitureId = parseInt(req.body.furnitureId);
            const furniture = furnitures.find(furniture => furniture.id === furnitureId);
            const body = req.body;
            if ('amount' in body && typeof body.amount === 'number' && body.amount > 0) {
                furniture.amount += body.amount;
                res.status(202).send(furniture);
            } else {
                res.status(400).send({ problem: 'Amount should be positive number' });
            }
        } else {
            res.status(400).send({ problem: err });
        }
    });
});

app.listen(
    dotenv.FURNITURE_PORT,
    () => console.log(`Furniture listening on port ${dotenv.FURNITURE_PORT}`)
);

