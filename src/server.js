const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json()); 

const router = require('./BackEnd/routes/post.route.js');
app.use(router);

app.listen(PORT, () => console.log(`Server đang chạy tại http://localhost:${PORT}`));

// npm run dev