#!/usr/bin/env node
//Choix environnement
//Import des modules https,path,port,fs
//création des variables nonSecuriser,options,server 
//création des variavles des certificats dans le dossier ca et server contenant les cles du serveur
//c//progress.argv est un tableau qui va contenir des arguments de l'occurence l'argument des ports
var https = require ('https');

var http = require ('http');
var path = require ('path');
var port = process.argv[2] || 3000;
var securitePort = process.argv[3] || 4000;
var fs = require ('fs');
var checkip = require ('checkip');
var server
var nonSecuriser
var options
var certificatChemin = path.join(__dirname, 'certs', 'server');
var caCertificatChemin = path.join(__dirname, 'certs', 'ca');

//Methode qui va nous permettre de ecup les clés
//La méthode fs.readfileSync() est utilisé pour lire les fichiers et renvoyer son contenu
// En l'occurence nous voulons lire les clés contenu dan sle répertoire ca et server
options={
    key: fs.readFileSync(path.join(certificatChemin, 'mon-server.key.pem'))
    ,cert: fs.readFileSync(path.join(certificatChemin, 'mon-server.crt.pem'))
};
// Création du serveur avec express en récupérant la variable "server"
//server ---> appel la variable server et création de l'object https en faisant appel à la variable options pour certifier le serveur
//checkip --->  var host definit l'adresse ip-dns du serveur et rdirige les utilisateurs en "https"
// var host fefinit le nom dde domaine créé "nextformation.technique.fr"
server = https.createServer(options);
checkip.getExternalIp().then(function (ip) {
    var host = ip || 'nextformation.technique.fr';


//Création de fonction d'écoute de l'ensemble des ports et du serveur avec un console log qui nous indiquera les messages suivants "lancement su site à l'adrese suivante"
//server.on permet d'envoyer une requête  au fichier app.js 
//server.listen permet l'écoute sur le port et l'adresse du serveur
//if (ip) definit un autre moyen de se connecter "affichage des liens co"
//

function listen(app) 
{
    server.on('request',app);
    server.listen(port,function() { 
    port = server.address().port;
        console.log('access address https://nextformation.technique.fr:8000');
        console.log('access address https://127.0.0.1:8000');
        if (ip){
        console.log('access address http://127.0.0.1:3000');
        }
});

}
//Création d'une variable cheminPublic pour stocker les utilisateurs
//Appelle du module app pour créé les répertoires server,host,port,chemin

var cheminPublic = path.join(__dirname, 'public');
var app = require('./app').create(server, host, port, cheminPublic);
listen(app);
});
// redirection de tout le traffic http en https
//nonSecuriser permet de redigiré l'emplacement non sécurisé

nonSecuriser = http.createServer();
nonSecuriser.on(' request', function (req,res){
  //Redirection des mises à niveausx des websockets
  //301 Permet une redirection permanente
  //302 Permet une redirection non permanente
  //404 erreur de code
  //500 erreur de serveur 
res.setHeader(
    'location'
    ,'https://' +  req.headers.host.replace(  +port ) + req.url);
res.statusCode = 302;
res.end();
});
nonSecuriser.listen(securitePort, function(){
    console.log('Bonjour tout le monde vous êtes sur mon site');
});