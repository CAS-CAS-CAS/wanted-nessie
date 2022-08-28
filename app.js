const express = require('express');
const Datastore = require('nedb');

const app = express();
app.listen(3000, () => console.log("App Callback"));
app.use(express.static('public'));

app.use(express.json({limit: '1mb'})); 

const database = new Datastore('dawgs.db');
database.loadDatabase();

app.get('/api', (req, res) => {
    database.find({}, (err,data) =>{
        if(err){
            res.end();
            return; 
        }
        res.json(data);
    })
})

app.get('/user', (req, res) => {
    let targetID = JSON.stringify(req.headers.referer).split("?=")[1].slice(0,-1);
    database.find({ID: targetID}, (err,data) =>{
        if(err){
            res.end();
            return; 
        }
        res.json(data);
    })
})

app.post('/api', (req, res) => {
    database.insert(req.body);
    res.json(Date.now());
});

console.log("ROCK Bottom")