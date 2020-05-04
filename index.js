// Appel de fonction
var http = require('http');
var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/fac";

// Creation du serveur
var server = http.createServer(function(req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end('<p>Voici un paragraphe <strong>HTML</strong> !</p>');
});

var app = express();
app.use(express.urlencoded({ extended: true }));

// Accès à la page racine
app.get('/', function(req, res) {
    res.render("index.ejs");

});

app.use(function(req, res){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
});

// Ouverture du port 8080
app.listen(8080);