const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    stack: Array,
    labels: Array,
    active: Boolean
})

module.exports = mongoose.model("Forms", schema)