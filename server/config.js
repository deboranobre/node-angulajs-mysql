var express = require('express');
var app = express();
var bodyParser = require("body-parser");

var collectionController = require('./controllers/collection.js');
var recordController = require('./controllers/record.js');

//STATIC FILES
app.use(express.static('public'));
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Body parser use JSON data

app.use(collectionController);
app.use(recordController);

var server = app.listen(8081, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("App listening at: " + host + ":" + port);

})

