require("dotenv")
    .config();

const express =
    require("express");

const mongoose =
    require("mongoose");

const cors =
    require("cors");

const bcrypt =
    require("bcryptjs");

const jwt =
    require("jsonwebtoken");

const User =
    require("./models/User");

const Task =
    require("./models/Task");

const auth =
    require("./middleware/auth");

const app =
    express();

app.use(cors());
app.use(express.json());


// MongoDB
mongoose.connect(
    process.env.MONGO_URI
)

    .then(() =>
        console.log(
            "MongoDB Connected"
        ))

    .catch(err =>
        console.log(err));



// ---------- SIGNUP ----------

app.post(
    "/signup",
    async (req, res) => {

        try {

            const {
                name,
                email,
                password
            } = req.body;

            if (
                !name ||
                !email ||
                !password
            ) {

                return res.status(400)
                    .json({
                        message:
                            "All fields required"
                    });
            }

            const existingUser =
                await User.findOne({
                    email
                });

            if (existingUser) {

                return res.json({
                    message:
                        "Email already exists"
                });
            }

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );

            const user =
                new User({
                    name,
                    email,
                    password:
                        hashedPassword
                });

            await user.save();

            res.json({
                message:
                    "Signup Successful"
            });

        } catch (error) {

            console.log(
                error
            );

            res.status(500)
                .json({
                    message:
                        "Signup Failed"
                });
        }
    });



// ---------- LOGIN ----------

app.post(
    "/login",

    async (
        req,
        res
    ) => {

        try {

            const {
                email,
                password
            }
                =
                req.body;

            const user =
                await User
                    .findOne({
                        email
                    });

            if (!user) {

                return res
                    .json({

                        message:
                            "User not found"

                    });
            }

            const isMatch =
                await bcrypt
                    .compare(

                        password,

                        user.password

                    );

            if (
                !isMatch
            ) {

                return res
                    .json({

                        message:
                            "Invalid Password"

                    });
            }

            const token =
                jwt.sign(

                    {
                        id:
                            user._id
                    },

                    process.env
                        .JWT_SECRET,

                    {
                        expiresIn:
                            "1d"
                    }

                );

            res.json({

                message:
                    "Login Successful",

                token

            });

        } catch (
        error
        ) {

            res.status(500)
                .json({

                    message:
                        error.message

                });
        }
    });



// ---------- GET TASKS ----------

app.get(
    "/tasks",
    auth,

    async (
        req,
        res
    ) => {

        const tasks =
            await Task
                .find({

                    userId:
                        req.user.id

                })

                .sort({
                    createdAt:
                        -1
                });

        res.json(
            tasks
        );
    });



// ---------- ADD TASK ----------

app.post(
    "/tasks",
    auth,

    async (
        req,
        res
    ) => {

        const task =
            new Task({

                title:
                    req.body.title,

                category:
                    req.body.category,

                dueDate:
                    req.body.dueDate,

                userId:
                    req.user.id

            });

        await task
            .save();

        res.json(
            task
        );
    });



// ---------- UPDATE TASK ----------

app.put(
    "/tasks/:id",
    auth,

    async (
        req,
        res
    ) => {

        const task =
            await Task
                .findOneAndUpdate(

                    {

                        _id:
                            req.params.id,

                        userId:
                            req.user.id

                    },

                    req.body,

                    {
                        returnDocument:
                            "after"
                    }

                );

        res.json(
            task
        );
    });



// ---------- DELETE TASK ----------

app.delete(
    "/tasks/:id",
    auth,

    async (
        req,
        res
    ) => {

        await Task
            .findOneAndDelete({

                _id:
                    req.params.id,

                userId:
                    req.user.id

            });

        res.json({

            message:
                "Task Deleted"

        });
    });



const PORT =
    process.env
        .PORT
    || 3000;

app.listen(
    PORT,
    () => {

        console.log(
            `Server Running on Port ${PORT}`
        );

    });