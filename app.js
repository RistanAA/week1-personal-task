const express = require('express');
const connect = require('./schemas');
const postRouter = require('./routes/posts')

connect();

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api', [postRouter]);

app.listen(process.env.PORT || 5000 , () => {
    console.log(port, 'Server is open with port!');
});