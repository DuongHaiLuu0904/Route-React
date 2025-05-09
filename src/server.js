const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;

const database = require('./BackEnd/data/database')
database.connect()

app.use(cors());
app.use(express.json()); 

const postRouter = require('./BackEnd/routes/post.route.js');
app.use(postRouter);

const userRouter = require('./BackEnd/routes/user.route.js');
app.use(userRouter);

app.listen(PORT, () => console.log(`Server đang chạy tại http://localhost:${PORT}`));

// npm run dev