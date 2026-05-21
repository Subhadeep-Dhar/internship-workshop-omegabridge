const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const auth = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(express.json());


// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/userDashboard")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


// ---------------- SIGNUP ----------------

app.post("/signup", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.json({
                message: "Email already exists"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.json({
            message: "Signup Successful"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
});


// ---------------- LOGIN ----------------

app.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.json({
                message: "User Not Found"
            });
        }

        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isMatch) {
            return res.json({
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id
            },
            "secretkey",
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login Successful",
            token
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
});


// -------- GET ALL USERS --------

app.get("/users", auth, async (req, res) => {

    try {

        const users = await User.find()
            .select("-password");

        res.json(users);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
});


// -------- ADD USER --------

app.post("/users", auth, async (req, res) => {

    try {

        const { name, email, password } =
            req.body;

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.json({
            message: "User Added"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
});


// -------- UPDATE USER --------

app.put("/users/:id", auth, async (req, res) => {

    try {

        await User.findByIdAndUpdate(
            req.params.id,
            req.body
        );

        res.json({
            message: "User Updated"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
});


// -------- DELETE USER --------

app.delete("/users/:id", auth, async (req, res) => {

    try {

        await User.findByIdAndDelete(
            req.params.id
        );

        res.json({
            message: "User Deleted"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
});


// -------- SEARCH USER --------

app.get("/search/:name", auth, async (req, res) => {

    try {

        const users = await User.find({
            name: {
                $regex: req.params.name,
                $options: "i"
            }
        }).select("-password");

        res.json(users);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
});


// -------- PROFILE --------

app.get("/profile", auth,
async (req, res) => {

    try {

        const user = await User.findById(
            req.user.id
        ).select("-password");

        res.json(user);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
});


// Server
app.listen(3000, () => {
    console.log("Server Running on Port 3000");
});