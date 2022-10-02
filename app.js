const express = require('express');
const Datastore = require('nedb');

const app = express();
app.listen(3000, () => console.log("App Callback"));
app.use(express.static('public'));

app.use(express.json({limit: '1mb'})); 

const dogsDB = new Datastore('dawgs.db');
dogsDB.loadDatabase();

const pinsDB = new Datastore('pins.db');
pinsDB.loadDatabase();

app.get('/api', (req, res) => {
    dogsDB.find({}, (err,data) =>{
        if(err){
            res.end();
            return; 
        }
        res.json(data);
    })
})

app.post('/pins', (req, res) => {
    pinsDB.insert(req.body);
})

app.get('/pet', (req, res) => {
    let targetID = JSON.stringify(req.headers.referer).split("?=")[1].slice(0,-1);
    dogsDB.find({ID: targetID}, (err,data) =>{
        if(err){
            res.end();
            return; 
        }
        res.json(data);
    })
})

app.post('/api', (req, res) => {
    dogsDB.insert(req.body);
    res.json(Date.now());
});

console.log("ROCK Bottom")