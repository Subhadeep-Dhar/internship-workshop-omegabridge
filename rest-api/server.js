const express = require("express");

const app = express();

app.use(express.json());

let users = [

    {
        id: 1,
        name: "Rahul",
        email: "rahul@example.com",
        age: 22
    },

    {
        id: 2,
        name: "Aditi",
        email: "aditi@example.com",
        age: 17
    }

];

app.get("/users", (req, res) => {
    res.json(users);
});

app.get("/users/search", (req, res) => {

    const name = req.query.name;

    const result = users.filter(
        u => u.name.toLowerCase() === name.toLowerCase()
    );

    res.json(result);
});

app.get("/users/adults", (req, res) => {
    const adults = users.filter(u => u.age >= 18);
    res.json(adults);
});

app.get("/users/emails", (req, res) => {
    const emails = users.map(u => u.email);
    res.json(emails);
});

app.get("/users/:id", (req, res) => {

    const user = users.find(u => u.id == req.params.id);

    if (!user) {
        return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
});

app.post("/users", (req, res) => {

    if (!req.body.name || !req.body.email || !req.body.age) {
        return res.status(400).json({
            msg: "Name, Email and Age required"
        });
    }

    const newUser = {
        id: users.length + 1,
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
    };

    users.push(newUser);

    res.status(201).json(newUser);
});

app.put("/users/:id", (req, res) => {

    const id = parseInt(req.params.id);

    let user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({ msg: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.age = req.body.age || user.age;

    res.json(user);
});

app.listen(3000, () => {
    console.log("API running at http://localhost:3000");
});