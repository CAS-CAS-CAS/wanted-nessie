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

app.get('/pins', (req, res) => {
    pinsDB.find({}, (err, data) => {
        if(err){
            res.end();
            return;
        }
        else{
            res.json(data)
        }
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
//manual loading
//pinsDB.insert(JSON.parse(`{"Pin Location":[[-12459128.539720364,3951015.6953155547],[-12459119.577590765,3950920.0137351654],[-12459069.840337435,3950902.2900858456],[-12458960.811202241,3950940.676552443],[-12458992.586873606,3950860.7311839922],[-12459099.983137714,3950840.059036023],[-12459038.531200666,3950817.949961496],[-12458937.615102105,3950823.809636028],[-12458901.071447164,3950916.6033672653],[-12458812.327236224,3951046.7571889875],[-12458940.409644337,3951065.880442097],[-12458803.859633299,3950978.9137279694],[-12458729.619982962,3950915.665632726],[-12458797.804014236,3950832.1885973806],[-12458852.155294724,3950774.408287608],[-12459076.166546565,3951020.1927090646],[-12459042.22615467,3950939.79013671],[-12458977.424499221,3950988.05780606],[-12458891.764081964,3950988.356388202],[-12458895.685305243,3951003.2738319244],[-12458905.592167398,3951023.7407046715]]}`))
console.log("ROCK Bottom")