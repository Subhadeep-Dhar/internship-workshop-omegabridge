const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        minlength: 3
    },

    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+@.+\..+/
    },

    age: {
        type: Number,
        min: 1,
        max: 100
    }

});

const User = mongoose.model("User", userSchema);

module.exports = User;