const Chat = require('../models/Chat')
const Message = require('../models/Message')

async function getChatList(){
    const list = await Chat.find({}).lean()
    if(!list){
        return "List empty"
    }
    return list    
}

async function createChat(name){
    const chat = await Chat.create({name})
    return chat;
}

async function getChat(id){
    const chat = await Chat.findById(id)
    if(chat){
        const messages = await Message.find({chatId: chat._id}).lean()
        // const formated = messages.map(mes => { 
        //     return {
        //         message: mes.message,
        //         username: mes.username,
        //         chatId: mes.chatId
        //     } 
        // })
        return messages;
    }
    throw "Incorrect chat id"
}
async function createMessage({username, chatId, message}){
    const msg = await Message.create({username, chatId, message})
    //return msg.lean();
}


module.exports = {
    getChat, getChatList, createChat, createMessage
}