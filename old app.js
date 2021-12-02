const express = require('express');
const consolidate = require('consolidate');
const MongoClient = require('mongodb').MongoClient;
const favicon = require('serve-favicon');
const session = require('express-session');
const bodyParser = require("body-parser");
const https = require('https');
const fs = require('fs');
const mongoose = require('mongoose')


let oldApp = express ();
const port = 8090;


oldApp.use(bodyParser.urlencoded({ extended: true }));
oldApp.use(session({
    secret: "randompass",
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: '/',
        httpsOnly: true,
        maxAge: 3600000
    }
}));


oldApp.engine ( 'html', consolidate.hogan );
oldApp.set('views', __dirname + '/private');
oldApp.use(express.static(__dirname + '/static'));
oldApp.use(favicon(__dirname + '/static/img/logos/favicon.ico'));


// Connect to the db and wait for requests
mongoose.connect('mongodb://localhost:27017/', function(err, db) {
    if (err) throw err;

    let dataBase = db.db("finalAppSinf");

    function comments(post_id,posts,games,f){
        let comments = [];
        dataBase.collection('comments').find({"post_id":parseInt(post_id)}).toArray(function(err, comms){
            for (let j=0; j<comms.length; j++){
                comments[j] = {};
                comments[j]["content"] = comms[j]["content"];
                comments[j]["date"] = comms[j]["date"];
                comments[j]["likes"] = comms[j]["likes"];

                dataBase.collection('users').find({"id":parseInt(comms[j]["author_id"])}).toArray(function(err, user){
                    comments[j]["author"] = user[0]["username"];
                }); //TODO users dont work

            }

            f(posts,games,comments)

        });
    }

    function posts(f,post_id=null){
        let arg = {};
        if (post_id != null){
            arg = {"id":parseInt(post_id)};
        }
        dataBase.collection('posts').find(arg).toArray(function(err, posts){
            if (err) throw err;

            dataBase.collection('games').find().toArray(function(err, games){
                if (err) throw err;

                for (let i = 0; i<posts.length; i++) {
                    let game_id = posts[i]["game_id"];
                    let user_id = posts[i]["author_id"]

                    posts[i]["game_id"] = games[game_id]["name"];

                    dataBase.collection('users').find({"id":parseInt(user_id)}).toArray(function(err, user){
                        posts[i]["author"] = user[0]["username"];
                    });

                }

                if (post_id != null){
                    comments(post_id,posts,games,f)
                }
                else{
                    f(posts,games)
                }

            });

        });
    }


    // GET request for "/"
    oldApp.get('/', function(req, res) {

        posts(function (posts,games){
            let data = {
                "logged" : false,
                "posts" : posts,
                "games" : games
            }
            res.render("home.html",data)
        });

    });


    oldApp.get('/add-post', function(req, res) {

        let data = {
            "logged" : true
        }
        res.render("newpost.html", data)

    });

    oldApp.get('/post', function(req, res) {

        posts(function (posts,games,comments){
            let data = {
                "logged" : true,
                "posts" : posts,
                "games" : games,
                "comments" : comments
            }
            res.render("post.html",data);
        },req.query.id);

    });

    oldApp.get('/posts', function(req, res) {

        let data = {
            "logged" : true
        }
        console.log(req.query.search);
        console.log(req.query.filter);
        res.render("all_posts.html",data);

    });

    oldApp.get('/user-profile', function(req, res) {

        let data = {
            "logged" : true
        }
        res.render("profile.html", data)

    });

    oldApp.get('/log', function(req, res) {

        res.render("login.html")

    });

    oldApp.get('/logout', function(req, res) {

        res.render("home.html")

    });

    oldApp.post('/add-comment', function(req, res) {

        console.log(req.body.comm)
        res.redirect("post")

    });


    // GET request for "*" send message for page not found
    oldApp.get('*', function(req, res) {
        res.status(404).render('404.html');
    });


    // Lance le server avec le protocole https sur le port, url: https://localhost:'port'
    https.createServer({
        key: fs.readFileSync('./key.pem'),
        cert: fs.readFileSync('./cert.pem'),
        passphrase: 'INGI'
    }, oldApp).listen(port);
    console.log('Server successfully started on port ' + port + ' access with ' + 'https://localhost:' + port);

});