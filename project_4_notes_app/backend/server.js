require("dotenv").config();

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

const Note =
    require("./models/Note");

const auth =
    require("./middleware/auth");

const app =
    express();

app.use(cors());
app.use(express.json());


// ---------- MONGODB ----------

mongoose.connect(
    process.env.MONGO_URI
)

    .then(() => {

        console.log(
            "MongoDB Connected"
        );

    })

    .catch(err =>
        console.log(err));



// ---------- HOME ----------

app.get(
    "/",
    (req, res) => {

        res.send(
            "Notes API Running"
        );

    });



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
            } =
                req.body;

            const existingUser =
                await User.findOne({
                    email
                });

            if (
                existingUser
            ) {

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
            } =
                req.body;

            const user =
                await User.findOne({
                    email
                });

            if (!user) {

                return res.json({

                    message:
                        "User Not Found"

                });
            }

            const isMatch =
                await bcrypt.compare(

                    password,
                    user.password
                );

            if (!isMatch) {

                return res.json({

                    message:
                        "Wrong Password"

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

            console.log(
                error
            );

            res.status(500)
                .json({

                    message:
                        "Login Failed"

                });
        }
    });



// ---------- GET NOTES ----------

app.get(
    "/notes",
    auth,

    async (
        req,
        res
    ) => {

        const notes =
            await Note.find({

                userId:
                    req.user.id

            })

                .sort({

                    pinned:
                        -1,

                    createdAt:
                        -1
                });

        res.json(
            notes
        );
    });



// ---------- CREATE NOTE ----------

app.post(
    "/notes",
    auth,

    async (
        req,
        res
    ) => {

        try {

            const {

                title,
                content,
                color

            } =
                req.body;

            const note =
                new Note({

                    title,
                    content,
                    color,

                    userId:
                        req.user.id
                });

            await note.save();

            res.json({

                message:
                    "Note Created"

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
                        "Failed To Create Note"

                });
        }
    });



// ---------- UPDATE NOTE ----------

app.put(
    "/notes/:id",
    auth,

    async (
        req,
        res
    ) => {

        try {

            await Note.findByIdAndUpdate(

                req.params.id,

                req.body
            );

            res.json({

                message:
                    "Note Updated"

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
                        "Update Failed"

                });
        }
    });



// ---------- DELETE NOTE ----------

app.delete(
    "/notes/:id",
    auth,

    async (
        req,
        res
    ) => {

        try {

            await Note.findByIdAndDelete(
                req.params.id
            );

            res.json({

                message:
                    "Deleted"

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