const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
    userid: {
        type: String,
        require: true,
        trim: true,
        unique: true,
        lowercase: true,
        index: true,
    },
    password: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        enum: ["user","admin"],
        default: "user",
    },
},{ timestamps: true});

userSchema.method({
    async authenticate(password) {
        return bcrypt.compare(password, this.password);
    },
});

module.exports = mongoose.model("User",userSchema);
