const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8080;

const database = require('./BackEnd/data/database');
database.connect();

app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));


app.use(express.json());

const postRouter = require('./BackEnd/routes/post.route.js');
const userRouter = require('./BackEnd/routes/user.route.js');

app.use(postRouter);
app.use(userRouter);

app.listen(PORT, () => console.log(`Server đang chạy tại http://localhost:${PORT}`));

// npm run dev