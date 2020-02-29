'use strict';
module.exports = function(app) {
  var c = require('../controllers/controller.js');

  // todoList Routes
  app.route('/new_college')
    .get(c.new_college_all)

  app.route('/new_college/:day')
    .get(c.new_college_day)

};