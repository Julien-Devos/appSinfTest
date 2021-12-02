const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const {execMap} = require("nodemon/lib/config/defaults");

router.get('/', async (req, res) => {
    try{
        let posts = await Post.find();

        for (i in posts){
            console.log("curr "+ posts[i] + "\n\n")
            let user = await User.find({'id': posts[i]["author_id"]});

            console.log(user[0]["username"]+ "\n\n")
            posts[i]["author"] = user[0]["username"];
            console.log(posts[i])
        }

        console.log(posts)
        res.render('post.html');
    } catch (err) {
        res.json({ message:err });
    }
});

router.post('/', async (req,res) => {
   const post = new Post({
       game_id: req.body.game_id,
       author_id: req.body.author_id,
       title: req.body.title,
       content: req.body.content
   });

   try {
       const savedPost = await post.save();
       res.json(savedPost);
   } catch (err) {
       res.json({ message:err });
   }
});

router.post('/user', async (req,res) => {
    const user = new User({
        id: req.body.id,
        username: req.body.username,
        password: req.body.password,
        mail: req.body.mail
    });

    try {
        const savedUser = await user.save();
        res.json(savedUser);
    } catch (err) {
        res.json({ message:err });
    }
});

module.exports = router;