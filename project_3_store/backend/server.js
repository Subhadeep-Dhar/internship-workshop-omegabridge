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

const Product =
    require("./models/Product");

const Cart =
    require("./models/Cart");

const Order =
    require("./models/Order");

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

        seedProducts();

    })

    .catch(err =>
        console.log(err));



// ---------- SEED PRODUCTS ----------

async function seedProducts() {

    const count =
        await Product.countDocuments();

    if (count > 0)
        return;

    await Product.insertMany([

        {
            name:
                "Wireless Mouse",

            description:
                "Comfortable wireless mouse",

            price: 799,

            category:
                "Electronics",

            image:
                "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800",

            stock: 10
        },

        {
            name:
                "Gaming Keyboard",

            description:
                "RGB Mechanical Keyboard",

            price: 2499,

            category:
                "Electronics",

            image:
                "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800",

            stock: 8
        },

        {
            name:
                "T-Shirt",

            description:
                "Premium cotton casual t-shirt",

            price: 499,

            category:
                "Fashion",

            image:
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",

            stock: 20
        },

        {
            name:
                "Sports Shoes",

            description:
                "Comfortable running shoes",

            price: 2999,

            category:
                "Fashion",

            image:
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",

            stock: 12
        }

    ]);

    console.log(
        "Products Seeded"
    );
}



// ---------- HOME ----------

app.get(
    "/",
    (req, res) => {

        res.send(
            "Backend Running"
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
                        "User not found"
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



// ---------- PRODUCTS ----------

app.get(
    "/products",

    async (
        req,
        res
    ) => {

        const products =
            await Product.find();

        res.json(
            products
        );
    });



// ---------- ADD TO CART ----------

app.post(
    "/cart",
    auth,

    async (
        req,
        res
    ) => {

        try {

            const {
                productId
            } =
                req.body;

            const existing =
                await Cart.findOne({

                    userId:
                        req.user.id,

                    productId
                });

            if (
                existing
            ) {

                existing.quantity
                    += 1;

                await existing
                    .save();

                return res.json({
                    message:
                        "Quantity Updated"
                });
            }

            const cart =
                new Cart({

                    userId:
                        req.user.id,

                    productId
                });

            await cart.save();

            res.json({
                message:
                    "Added To Cart"
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
                        "Cart Failed"
                });
        }
    });



// ---------- GET CART ----------

app.get(
    "/cart",
    auth,

    async (
        req,
        res
    ) => {

        const cart =
            await Cart.find({

                userId:
                    req.user.id

            })

                .populate(
                    "productId"
                );

        res.json(
            cart
        );
    });



// ---------- REMOVE CART ITEM ----------

app.delete(
    "/cart/:id",
    auth,

    async (
        req,
        res
    ) => {

        await Cart.findByIdAndDelete(
            req.params.id
        );

        res.json({
            message:
                "Removed"
        });
    });



// ---------- CHECKOUT ----------

app.post(
    "/checkout",
    auth,

    async (
        req,
        res
    ) => {

        try {

            const cart =
                await Cart.find({

                    userId:
                        req.user.id

                })

                    .populate(
                        "productId"
                    );

            if (
                cart.length === 0
            ) {

                return res.json({
                    message:
                        "Cart Empty"
                });
            }

            let total = 0;

            const products =
                cart.map(item => {

                    total +=
                        item.productId.price *
                        item.quantity;

                    return {

                        product:
                            item.productId.name,

                        price:
                            item.productId.price,

                        quantity:
                            item.quantity
                    };

                });

            const order =
                new Order({

                    userId:
                        req.user.id,

                    products,

                    total
                });

            await order.save();

            await Cart.deleteMany({

                userId:
                    req.user.id
            });

            res.json({

                message:
                    "Order Placed",

                order

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
                        "Checkout Failed"
                });
        }
    });



// ---------- GET ORDERS ----------

app.get(
    "/orders",
    auth,

    async (
        req,
        res
    ) => {

        const orders =
            await Order.find({

                userId:
                    req.user.id

            })

                .sort({
                    createdAt:
                        -1
                });

        res.json(
            orders
        );
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