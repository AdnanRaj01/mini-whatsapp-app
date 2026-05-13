const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const mongoose = require('mongoose');
const Chat = require('./models/chat');
const methodOverride = require('method-override');

app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


main().then(() => console.log('Connected to MongoDB'))
.catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/mychatdatabase');
}

app.get('/', (req, res) => {
    res.send('server is running');
});

app.get('/chats', async (req, res) => {
    try {
        let chats = await Chat.find();
        res.render('index.ejs', { chats });
    } catch (err) {
        console.log(err);
        res.send("Error loading chats");
    }
});

app.get('/chats/new', (req, res) => {
    res.render('new.ejs');
});

app.post('/chats', async (req, res) => {
    let { from, to, message } = req.body;
    let newchat = new Chat({ 
        from, 
        to, 
        message, 
        created_at: new Date() 
    });
    await newchat.save();
    res.redirect('/chats');
});

app.get('/chats/:id/edit', async (req, res) => {
    let chat = await Chat.findById(req.params.id);
    res.render('edit.ejs', { chat });
});

app.put('/chats/:id', async (req, res) => {
   let {id} = req.params;
   let { message: newMessage } = req.body;
   let updatedChat = await Chat.findByIdAndUpdate(
    id,
    { message: newMessage },
    { runValidators: true, new: true }
);
   res.redirect('/chats');
});

app.delete('/chats/:id', async (req, res) => {
    let {id} = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    res.redirect('/chats');
});