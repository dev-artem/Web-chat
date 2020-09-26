const { getChat, getChatList, createChat } = require('../services/chatService');

module.exports.get_list = async (req, res) => {
    try {
        const chatlist = await getChatList();
        res.status(200).render('chatlist', {chatlist});
    } catch (error) {
        console.log(error)
        res.status(400).json({error})
    }
}

module.exports.create_chat = async (req, res) => {
    const {name} = req.body;
    try {
        const chat = await createChat(name);
        res.status(201).json(chat);
    } catch (error) {
        console.log(error)
        res.status(400).json({error})
    }
}

module.exports.get_chat = async (req, res) => {
    const id = req.params.id;
    try {
        const chat = await getChat(id);
        res.status(200).render('chat', {chat});
    } catch (error) {
        console.log(error)
        res.status(400).json({error})
    }
}