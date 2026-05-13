const mongoose = require('mongoose');
const Chat = require('./models/chat');

main()
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/mychatdatabase');
}

let allChats = [
    {
        from: 'Adnan',
        to: 'Ali',
        message: 'Hello Ali',
        created_at: new Date()
    },
    {
        from: 'Ali',
        to: 'Adnan',
        message: 'Hi Adnan',
        created_at: new Date()
    }
];

async function initDB() {
    await Chat.insertMany(allChats);
    console.log('Database initialized');
}

initDB();