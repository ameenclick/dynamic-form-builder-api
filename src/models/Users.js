const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    user: String,
    designation: String,
    forms: Array
})

module.exports = mongoose.model("User", schema)