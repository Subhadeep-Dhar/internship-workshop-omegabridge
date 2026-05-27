const mongoose =
    require("mongoose");

const orderSchema =
    new mongoose.Schema({

        userId: {

            type:
                mongoose.Schema
                    .Types.ObjectId,

            ref: "User"
        },

        products: Array,

        total: Number,

        status: {

            type: String,

            default:
                "Placed"
        },

        createdAt: {

            type: Date,

            default:
                Date.now
        }

    });

module.exports =
    mongoose.model(
        "Order",
        orderSchema
    );