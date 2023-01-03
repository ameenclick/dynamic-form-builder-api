const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    formId: String,
    userId: String,
    versionId: String, 
    response: Array
})

module.exports = mongoose.model("Response", schema)