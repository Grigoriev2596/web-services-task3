const express = require('express');
const dotenv = require('../node_modules/dotenv').config({path: '../.env'}).parsed;
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

app.use(bodyParser.json());

const availableOrders = [
    {
        id: 1,
        name: 'Order 1',
        makerId: null,
        makerName: null,
        furnitureId: null,
        furnitureName: null,
    },
    {
        id: 2,
        name: 'Order 2',
        makerId: null,
        makerName: null,
        furnitureId: null,
        furnitureName: null,
    },
    {
        id: 3,
        name: 'Order 3',
        makerId: null,
        makerName: null,
        furnitureId: null,
        furnitureName: null,
    },
];

app.get('/availableOrders', (req, res) => {
    console.log('Returning available orders list');
    res.send(availableOrders);
});

app.post('/furniture/**', (req, res) => {
    const orderId = req.params[0];
    const foundOrderIndex = availableOrders.findIndex(order => order.id === +orderId);

    if (foundOrderIndex !== -1) {
        availableOrders[foundOrderIndex].furnitureId = req.body.furnitureId;
        availableOrders[foundOrderIndex].furnitureName = req.body.furnitureName;
        res.status(202).header({
            Location: `http://localhost:${dotenv.ORDER_PORT}/furniture/${orderId}`
        }).send({});
    } else {
        res.status(404).send();
    }
});

app.post('/maker/**', (req, res) => {
    const orderId = req.params[0];
    const foundOrderIndex = availableOrders.findIndex(order => order.id === +orderId);

    if (foundOrderIndex !== -1) {
        availableOrders[foundOrderIndex].makerId = req.body.makerId;
        availableOrders[foundOrderIndex].makerName = req.body.makerName;
        res.status(202).header({
            Location: `http://localhost:${dotenv.ORDER_PORT}/maker/${orderId}`
        }).send({});
    } else {
        res.status(404).send();
    }
});

app.listen(
    dotenv.ORDER_PORT,
    () => console.log(`Orders listening on port ${dotenv.ORDER_PORT}`)
);

