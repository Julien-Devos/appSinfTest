const express = require('express');
const router = express.Router();
const Post = require('../models/Post')
const User = require('../models/User')
const Game = require('../models/Game')
const {execMap} = require("nodemon/lib/config/defaults");

router.get('/', async (req, res) => {
    try{
        const posts = await Post.find();
        const games = await Game.find();

        for (i in posts){
            const user = await User.findOne({'_id':posts[i]['author_id']});
            posts[i]['author'] = user['username'];
            const game = await Game.findOne({'id':posts[i]['game_id']});
            posts[i]['game'] = game['name']

        }

        let data = {
            "logged" : true,
            "posts" : posts,
            "games" : games
        }

        res.render('home.html',data);

    } catch (err) {
        if (err) throw err;
    }
});

module.exports = router;