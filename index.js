
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
app.use(express.json());
require('dotenv').config();

const posts = [{
    name: "zubair",
    title: "post 1"
}, {
    name: "jaisha",
    title: "post 2"
}]

app.get('/', (req, res) => {
    res.json(posts);
})

//middeleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {  //callback
        if (err) {
            return res.sendStatus(403);


        }
        req.user = user;
        next();  //finishmiddleware
    })


}



app.post('/login', (req, res) => {
    const username = req.body.username;
    const user = { name: username };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN);
    res.json({ accessToken: accessToken })

})

app.get("/posts", authenticateToken, (req, res) => {   ///authendicate middleware
    console.log(req.user.name);
    res.json(posts.filter(post => post.name === req.user.name));

})


app.listen(3000);
