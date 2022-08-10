const express = require('express');
const Datastore = require('nedb');
const fs = require('fs');


const app = express();
app.listen(3000, () => console.log("App Callback"));
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));



const database = new Datastore('dawgs.db');
database.loadDatabase();




//app.use(express.json())

/*
app.get('/', (req, res) => {
    console.log("Ello Govna")
})*/

app.post('/api', (req, res) => {
    console.log(req.body);
    //must have something in the array
    fs.writeFile('public/data/DogData.txt', ("\n").concat(JSON.stringify(req.body)), {flag: 'a'}, err => {})
    res.end();
});

console.log("Last Line Ran")