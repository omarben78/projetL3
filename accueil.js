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

// Accès à la page connexion
app.get('/', function(req, res) {
    res.render("index.ejs");
});

// Accès à la page profil
app.get('/profil', function(req, res) {
    res.render("profil.ejs");
});

// Envoie du nom de l'utilisateur
app.post('/profil', function(req, res) {
    //var objet = {user: {username: 'toto', mdp: 'toto95'}};
    res.render("profil.ejs", {identifiant: req.body.identifiant});

    /*MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("projet");

        var myobj = {identifiant: req.body.identifiant};

        dbo.collection("login").find({}).toArray(function(err, result) {
            if (err) throw err;
            console.log("Utilisateur connectee");
            db.close();
        });
        res.redirect('/profil');
    });*/

});

// Accès à notre formulaire
app.get('/form', function(req, res) {
    res.render("form.ejs");
});

// Accès à notre formulaire
app.get('/inscription', function(req, res) {
    res.render("inscription.ejs");
});

// Accès à la liste des participants
app.get('/participants', function(req, res) {
    res.render("participants.ejs");
});

// Accès à la liste des sondages
app.get('/sondages/:id', function(req, res) {
    //res.render("form.ejs");
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("projet");
        var myobj = { id: req.params.id};

        dbo.collection("rdv").find({}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            res.render("sondages.ejs", myobj);
            //res.send(myobj);
            db.close();
        });

    });

});

// Accès à la page reponse
app.get('/reponse', function(req, res) {
    res.render("reponse.ejs");
});

// Envoie du formulaire
app.post('/reponse', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    //res.render("form.ejs");

    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("projet");

        var myobj = {choix: req.body.choix};

        dbo.collection("reponse").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 reponse a ete ajoutes");
            db.close();
        });
        res.redirect('/reponse');
    });
    //res.send(req.body.nom + " " + req.body.prenom + " " + req.body.email);
});

// Envoie du formulaire
app.post('/action', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    //res.render("form.ejs");

    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("projet");

        var myobj = { sondage: req.body.sondage, nom: req.body.nom, date: req.body.date, begintime: req.body.begintime, endtime: req.body.endtime, commentaire: req.body.commentaire};

        dbo.collection("rdv").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 rendez-vous a ete ajoutes");
            db.close();
        });
        res.redirect('/form');
    });
    //res.send(req.body.nom + " " + req.body.prenom + " " + req.body.email);
});

// Envoie du formulaire
app.post('/inscrit', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    //res.render("form.ejs");

    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("projet");

        var myobj = { identifiant: req.body.identifiant, email: req.body.email, mdp: req.body.mdp};

        dbo.collection("login").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 compte a ete creer");
            db.close();
        });
        res.redirect('/inscription');
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