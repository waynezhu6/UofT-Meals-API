const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cron = require('cron');

var routes = require('./api/routes/routes.js'); //importing route
var Menu = require('./menu.js');
  
var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
routes(app); //register the route

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

const connectionString = 'mongodb+srv://admin:z3ymsq4sRQiR6OCD@cluster-ws8ib.gcp.mongodb.net/UofT_Meals_API?retryWrites=true&w=majority';
var db;

app.listen(port, () => {
  mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    db = mongoose.connection.db;
    console.log("Connection to Atlas Cluster successful");
  })
  .catch((err) => console.error(err));
});
console.log('API server started on: ' + port);

menu = new Menu();
menu.update();

const job = cron.job(' 1 12 * * MON', () => {
  menu.update();
});

job.start();