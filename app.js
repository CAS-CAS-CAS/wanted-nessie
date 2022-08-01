const express = require('express');
const fs = require('fs');
const app = express();
app.listen(3000, () => console.log("App Callback"));
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));
//app.use(express.json())

/*
app.get('/', (req, res) => {
    console.log("Ello Govna")
})*/

app.post('/api', (req, res) => {
    console.log(JSON.stringify(req.body));
    fs.writeFile('public/data/DogData.txt', JSON.stringify(req.body).concat("\n"), {flag: 'a'}, err => {})
    res.end();
});

console.log("Last Line Ran")