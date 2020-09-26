const { Schema, model } = require('mongoose')
const User = require('./User')
const Chat = require('./Chat')

const messageSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        ref: User
    },
    chatId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: Chat
    }
}, {
    timestamps: true
})

module.exports = model('Message', messageSchema);