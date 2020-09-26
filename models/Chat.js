const { Schema, model } = require('mongoose')

const chatSchema = new Schema({
    name: {
        type: String,
        require: true,
        unique: true
    }
})

module.exports = model('Chat', chatSchema);