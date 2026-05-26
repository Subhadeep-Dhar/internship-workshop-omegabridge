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

const Post =
    require("./models/Post");

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

    async (
        req,
        res
    ) => {

        try {

            const {
                name,
                email,
                password
            }
                =
                req.body;

            if (
                !name ||
                !email ||
                !password
            ) {

                return res
                    .json({
                        message:
                            "All fields required"
                    });
            }

            const existingUser =
                await User
                    .findOne({
                        email
                    });

            if (
                existingUser
            ) {

                return res
                    .json({
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

        } catch (
        error
        ) {

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
                await bcrypt.compare(
                    password,
                    user.password
                );

            if (!isMatch) {

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
                            user._id,

                        name:
                            user.name
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
                        "Login Failed"
                });
        }
    });



// ---------- GET POSTS ----------

app.get(
    "/posts",

    async (
        req,
        res
    ) => {

        try {

            const posts =
                await Post.find()
                    .sort({
                        createdAt: -1
                    });

            res.json(
                posts
            );

        } catch (error) {

            console.log(error);

            res.status(500)
                .json({
                    message:
                        "Failed to load posts"
                });
        }
    });


// ---------- GET MY POSTS ----------

app.get(
    "/my-posts",
    auth,

    async (
        req,
        res
    ) => {

        try {

            const posts =
                await Post.find({

                    authorId:
                        req.user.id

                })

                    .sort({
                        createdAt:
                            -1
                    });

            res.json(
                posts
            );

        } catch (
        error
        ) {

            console.log(
                error
            );

            res.status(500)
                .json({
                    message:
                        "Failed to load posts"
                });
        }
    });



// ---------- CREATE POST ----------

app.post(
    "/posts",
    auth,

    async (
        req,
        res
    ) => {

        console.log(
            "POST ROUTE HIT"
        );

        console.log(
            req.user
        );

        try {

            const user =
                await User.findById(
                    req.user.id
                );

            if (!user) {

                return res
                    .status(404)
                    .json({
                        message:
                            "User not found"
                    });
            }

            const post =
                new Post({

                    title:
                        req.body.title,

                    content:
                        req.body.content,

                    authorId:
                        user._id,

                    authorName:
                        user.name

                });

            await post.save();

            res.json(
                post
            );

        } catch (error) {

            console.log(error);

            res.status(500)
                .json({
                    message:
                        "Failed to create post"
                });
        }
    });



// ---------- UPDATE POST ----------

app.put(
    "/posts/:id",
    auth,

    async (
        req,
        res
    ) => {

        try {

            const post =
                await Post
                    .findOneAndUpdate(

                        {

                            _id:
                                req.params.id,

                            authorId:
                                req.user.id

                        },

                        req.body,

                        {
                            returnDocument:
                                "after"
                        }

                    );

            res.json(
                post
            );

        } catch (error) {

            console.log(error);

            res.status(500)
                .json({
                    message:
                        "Update Failed"
                });
        }
    });



// ---------- DELETE POST ----------

app.delete(
    "/posts/:id",
    auth,

    async (
        req,
        res
    ) => {

        try {

            await Post
                .findOneAndDelete({

                    _id:
                        req.params.id,

                    authorId:
                        req.user.id

                });

            res.json({
                message:
                    "Post Deleted"
            });

        } catch (error) {

            console.log(error);

            res.status(500)
                .json({
                    message:
                        "Delete Failed"
                });
        }
    });



const PORT =
    process.env.PORT
    || 3000;

app.listen(
    PORT,
    () => {

        console.log(
            `Server Running on Port ${PORT}`
        );

    });