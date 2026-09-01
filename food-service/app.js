const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        service: "Food Service",
        application: "Zomato DevOps Demo",
        status: "UP"
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy"
    });
});

app.get("/foods", (req, res) => {
    res.json([
        {
            id: 1,
            name: "Veg Biryani",
            price: 180
        },
        {
            id: 2,
            name: "Paneer Pizza",
            price: 250
        },
        {
            id: 3,
            name: "Masala Dosa",
            price: 120
        }
    ]);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Food Service running on port ${PORT}`);
});
