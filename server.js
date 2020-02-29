const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cron = require('cron');
const cors = require('cors');

var routes = require('./api/routes/routes.js'); //importing route
var Menu = require('./menu.js');
  
var app = express();
var port = process.env.PORT || 5000;

app.use(cors({credentials: true, origin: true}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
routes(app); //register the route

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);
console.log('API server started on: ' + port);

menu = new Menu();
menu.update();

const job = cron.job(' 1 12 * * MON', () => {
  menu.update();
});

job.start();