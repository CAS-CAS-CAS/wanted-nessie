const express = require('express');

const app = express();
app.listen(3000, () => console.log("App Callback"));
app.use(express.static('public'));


/*
app.get('/', (req, res) => {
    console.log("Ello Govna")
})*/

app.post('/api', (req, res) => {
    console.log(req.body);
});

console.log("Last Line Ran")