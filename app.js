//Importation module express
//imoratation di module express(créé)
//Construction de l'application express
// App.use nous permet de forcer l'usage nous permet de forcer l'usage de public dir en statique et non en dynamique


var express = require('express');
module.exports.create= function (server,host,port,publicDir){
    var app = express ();
    app.use(express.static(publicDir));
    return app;

};

