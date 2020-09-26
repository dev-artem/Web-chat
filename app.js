const path = require('path');
const http = require('http');
const express = require('express');
const dotenv = require('dotenv')
const expressHbs = require('express-handlebars');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const socketio = require('socket.io');

const {checkUser, requireAuth} = require('./middlewares/authMiddleware');
const { createMessage } = require('./services/chatService');

const authRoutes = require('./routes/authRoutes')
const chatRoutes = require('./routes/chatRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const hbs = expressHbs.create({
    defaultLayout: 'layout',
    extname: 'hbs',
});
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'))

db.once('open', () => {
    console.log("MongoDB connected")

})

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());

app.get('*', checkUser);

app.get('/', requireAuth, (req, res) => {
    res.render('index')
})

app.use(authRoutes);
app.use(chatRoutes);


io.on('connect', (socket) => {
    let user;
    let chat;
    socket.on('join chat', ({chatId, username}) => {
        user = username;
        chat = chatId;
        socket.join(chatId)
        socket.broadcast.to(chatId).emit('message', {
            message: `${username} joined the chat`,
            username: 'Server'
        })
    })

    socket.on('message', ({message, chatId, username}) => {
        createMessage({message, chatId, username})

        io.to(chatId).emit('message', {message, username});
    })

    socket.on('disconnect', () => {
        socket.broadcast.to(chat).emit('message', {
            message: `${user} left the chat`,
            username: 'Server'
        })
    })
})