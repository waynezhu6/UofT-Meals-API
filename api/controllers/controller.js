var mongoose = require('mongoose');

const connectionString = 'mongodb+srv://admin:z3ymsq4sRQiR6OCD@cluster-ws8ib.gcp.mongodb.net/UofT_Meals_API?retryWrites=true&w=majority';
var db;

mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    db = mongoose.connection.db;
    console.log("Connection to Atlas Cluster successful");
  })
  .catch((err) => console.error(err));

exports.new_college_all = async function(req, res) {
  var data = {};
  var breakfast = db.collection('Breakfast').find({});
  var lunch = db.collection('Lunch').find({});
  var dinner = db.collection('Dinner').find({});
  data['Breakfast'] = await breakfast.toArray();
  data['Lunch'] = await lunch.toArray();
  data['Dinner'] = await dinner.toArray();
  res.send(JSON.stringify(data));
};

exports.new_college_day = async function(req, res) {
  var userDay = req.params.day;
  var data = {};
  var breakfast = db.collection('Breakfast').find({Day: userDay});
  var lunch = db.collection('Lunch').find({Day: userDay});
  var dinner = db.collection('Dinner').find({Day: userDay});
  data['Breakfast'] = await breakfast.toArray();
  data['Lunch'] = await lunch.toArray();
  data['Dinner'] = await dinner.toArray();
  res.send(JSON.stringify(data));
};