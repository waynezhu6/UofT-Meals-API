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
  var lunch = db.collection('Breakfast').find({});
  var dinner = db.collection('Breakfast').find({});
  data['Breakfast'] = await breakfast.toArray();
  data['Lunch'] = await lunch.toArray();
  data['Dinner'] = await dinner.toArray();
  res.send(JSON.stringify(data));
};

exports.new_college_day = function(req, res) {
  var new_task = new Task(req.body);
  new_task.save(function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.read_a_task = function(req, res) {
  Task.findById(req.params.taskId, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.update_a_task = function(req, res) {
  Task.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.delete_a_task = function(req, res) {

  Task.remove({
    _id: req.params.taskId
  }, function(err, task) {
    if (err)
      res.send(err);
    res.json({ message: 'Task successfully deleted' });
  });
};