const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/rest-api")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const User = require("./models/User");


app.post("/users", async (req, res) => {
    try {

        const user = await User.create(req.body);
        res.status(201).json(user);

    } catch (err) {

        res.status(400).json({ error: err.message });

    }
});

app.get("/users", async (req, res) => {

    const users = await User.find();
    res.json(users);

});

app.get("/users/:id", async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json(user);

    } catch (err) {
        res.status(400).json({ error: "Invalid ID" });
    }

});

app.put("/users/:id", async (req, res) => {

    try {

        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json(user);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }

});

app.delete("/users/:id", async (req, res) => {

    try {

        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json({ msg: "User deleted" });

    } catch (err) {
        res.status(400).json({ error: "Invalid ID" });
    }

});

app.get("/users/adults", async (req, res) => {

    const users = await User.find({ age: { $gte: 18 } });

    res.json(users);

});

app.get("/users/search", async (req, res) => {

    const name = req.query.name;

    const users = await User.find({
        name: new RegExp(name, "i")
    });

    res.json(users);

});

app.get("/users/emails", async (req, res) => {

    const users = await User.find({}, "email");

    res.json(users);

});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});