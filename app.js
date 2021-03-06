const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require("body-parser");
const consolidate = require('consolidate');
const favicon = require("serve-favicon");
const https = require("https");
const fs = require("fs");


const app = express();
const port = 8090;


app.engine ( 'html', consolidate.hogan );
app.set('views', __dirname + '/private');
app.use(express.static(__dirname + '/static'));
app.use(favicon(__dirname + '/static/img/logos/favicon.ico'));
app.use(bodyParser.json());


// import routes
const homeRoute = require('./routes/home');
const postRoute = require('./routes/post');
const postsRoute = require('./routes/posts');
const userRoute = require("./routes/user");
const gameRoute = require("./routes/game");
const loginRoute = require("./routes/login");
const registerRoute = require("./routes/register");

app.use('/', homeRoute);
app.use('/post', postRoute);
app.use('/posts', postsRoute);
app.use('/user', userRoute);
app.use('/game', gameRoute);
app.use('/login', loginRoute);
app.use('/register', registerRoute);


// connect to db
mongoose.connect('mongodb://localhost:27017/finalAppSinf', () => {
   console.log('connected to db!')
});


// create server with https protocol
https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: 'INGI'
}, app).listen(port);
console.log('Server successfully started on port ' + port + ' access with ' + 'https://localhost:' + port);

