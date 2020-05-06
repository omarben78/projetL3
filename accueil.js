// Appel de fonction
var http = require('http');
var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/projet";

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

// Accès à notre formulaire
app.get('/form', function(req, res) {
    res.render("form.ejs");
});

app.get('/participants', function(req, res) {
    res.render("participants.ejs");
});

app.get('/sondages/:id', function(req, res) {
    res.render("form.ejs");
    var objet = { id: req.params.id}
});

// Envoie du formulaire
app.post('/action', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    //res.render("form.ejs");

    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("projet");

        var myobj = { titre: req.body.titre, date: req.body.date, commentaire: req.body.commentaire};

        dbo.collection("rdv").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 rendez-vous a ete ajoutes");
            db.close();
        });
        res.redirect('/form');
    });
    //res.send(req.body.nom + " " + req.body.prenom + " " + req.body.email);
});

// Affichage de "page introuvable" si la page n'existe pas
app.use(function(req, res){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
});

// Ouverture du port 8080
app.listen(8080);