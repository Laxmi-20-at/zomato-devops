const express = require("express");

const app = express();

app.use(express.json());

let orders = [];

app.get("/", (req, res) => {
    res.json({
        service: "Order Service",
        application: "Zomato DevOps Demo",
        status: "UP"
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy"
    });
});

app.get("/orders", (req, res) => {
    res.json(orders);
});

app.post("/orders", (req, res) => {

    const order = {
        id: orders.length + 1,
        customer: req.body.customer,
        food: req.body.food,
        status: "PLACED"
    };

    orders.push(order);

    res.status(201).json(order);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
});
