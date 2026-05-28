const mongoose =
    require("mongoose");

const noteSchema =
    new mongoose.Schema({

        title: {

            type: String,
            required: true
        },

        content: {

            type: String,
            required: true
        },

        color: {

            type: String,

            default:
                "#ffffff"
        },

        pinned: {

            type: Boolean,

            default:
                false
        },

        userId: {

            type:
                mongoose.Schema
                    .Types.ObjectId,

            ref: "User"
        },

        createdAt: {

            type: Date,

            default:
                Date.now
        }

    });

module.exports =
    mongoose.model(
        "Note",
        noteSchema
    );