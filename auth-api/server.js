const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/authdb")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

const bcrypt = require("bcryptjs");
const User = require("./models/User");

app.post("/signup", async (req, res) => {
    try {

        const { name, email, password } = req.body;

        // check duplicate email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "Email already exists" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({ msg: "User created successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const jwt = require("jsonwebtoken");

app.post("/login", async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
        { id: user._id },
        "secretkey",
        { expiresIn: "1h" }
    );

    res.json({ token });

});

const auth = require("./middleware/auth");

app.get("/profile", auth, async (req, res) => {

    const user = await User.findById(req.user.id).select("-password");

    res.json(user);

});