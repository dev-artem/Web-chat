const { Router } = require('express');
const chatRouter = Router();
const chatController = require('../controllers/chatController');
const { requireAuth} = require('../middlewares/authMiddleware');


chatRouter.get('/list', requireAuth, chatController.get_list);
chatRouter.post('/list', requireAuth, chatController.create_chat);

chatRouter.get('/chat/:id', requireAuth, chatController.get_chat);

module.exports = chatRouter;