const express = require("express");

const app = express();


app.use(express.json());


app.use((req, res, next) => {

    console.log(`${req.method} ${req.url}`);

    next();

});


app.use(express.static("public"));


const users = [
    { id: 1, name: "Rahul" },
    { id: 2, name: "Aditi" }
];


app.get("/", (req, res) => {

    res.send("Welcome to My Express Server");

});


app.get("/about", (req, res) => {

    res.send("This is my Express.js project");

});


app.get("/contact", (req, res) => {

    res.send("Contact: rahul@example.com");

});


// GET API Users
app.get("/api/users", (req, res) => {

    res.json(users);

});


app.post("/api/users", (req, res) => {

    const newUser = req.body;

    users.push(newUser);

    res.json({
        message: "User added successfully",
        users: users
    });

});


app.get("/weather/:city", (req, res) => {

    res.json({
        city: req.params.city,
        temp: "30°C"
    });

});


app.listen(3000, () => {

    console.log("Server running at http://localhost:3000");

});