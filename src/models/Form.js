const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    version: String,
    title: String,
    description: String,
    grid: Number,
    fields: Array,
})

module.exports = mongoose.model("Form", schema)