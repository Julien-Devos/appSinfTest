const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const {execMap} = require("nodemon/lib/config/defaults");
const Post = require("../models/Post");
const User = require("../models/User");


router.get('/', async (req,res) => {
    try{
        let games = await Game.find();

        res.json(games);
    } catch (err) {
        if (err) throw err;
    }
});


router.post('/add', async (req,res) => {
    const game = new Game({
        name: req.body.name
    });

    try {
        const savedGame = await game.save();
        res.json(savedGame);
    } catch (err) {
        res.json({ message:err });
    }
});

module.exports = router;