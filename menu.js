const papaparse = require('papaparse'); 
const tabula = require('fresh-tabula-js');
const download = require('download-pdf');
const mongoose = require('mongoose');

class Menu{

    async update(){
      //unifying update function that gets new pdfs, parses, formats, then pushes to database
  
      var date = new Date();
      var weekStr = this.getWeeklyString(date);
      //var weekStr = "";
      await this.getMenus(weekStr);
      
      var files = ['./Breakfast.pdf', './Lunch.pdf', './Dinner.pdf'];
      var collections = ['Breakfast', 'Lunch', 'Dinner'];
  
      for(var i = 0; i < 3; i++){
        var fileName = files[i];
        var data = await this.extractData(fileName);
        data = this.formatArray(data);
        this.updateDatabase(collections[i], data);
      }
  
    }
  
    getWeeklyString(date){
      // gets a week string for the week containing date
      return "Feb24_Mar1"
    }
  
    async getMenus(week){
      //gets breakfast, lunch, and dinner menu pdfs for week
      var meals = ['Breakfast', 'Lunch', 'Dinner'];
  
      for(var i = 0; i < 3; i++){
        var mealStr = meals[i] + "_";
        var url = "http://ueat.utoronto.ca/wp-content/uploads/2020/02/New-College_" + mealStr + week + ".pdf";
        var options = {
          filename: meals[i] + ".pdf"
        }
  
        download(url, options, function(err){
          if(err){
            console.error(err);
          }
        });
  
      }
  
    }
  
    async extractData(fileName){
      //extracts csv from pdf table
  
      try{
        const table = new tabula(fileName, {spreadsheet: true});
        var text = await table.extractCsv().output;   
        text = text.replace(/\r/g, " ");
        text = text.replace(/\uFFFD/g, 'e')
        return this.parseText(text);
  
      }
      catch(err){
        console.error(err);
      }
    
    };
  
    parseText(text){
      //takes raw text and returns cleansed 2D array
  
      var parse = papaparse.parse(text).data;
      var table = [];

      if(parse[0][0].length > 9){
          parse.shift();
      }
  
      for(var i = 0; i < parse.length; i++){
        var row = parse[i];
        if(row[0].length == 0){
          row.shift();
        }
        if(row.length > 0){
          table.push(parse[i]);
        }
      }
      return table;
    }
  
    formatArray(array){
      // formats array into MongoDB-friendly object
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  
      var categories = [];
      for(var i = 2; i < array.length; i++){
        categories.push(clean(array[i][0]));
      }
  
      var menuObj = []
  
      for(var j = 1; j < 8; j++){
        var obj = {}
        obj['Day'] = days[j-1];

        for(var i = 0; i < categories.length; i++){
          obj[categories[i]] = clean(array[i + 2][j]);
        }
        
        menuObj[j - 1] = obj;
      }
  
      return menuObj;
    }
  
    async updateDatabase(collection, data){

      const connectionString = 'mongodb+srv://admin:z3ymsq4sRQiR6OCD@cluster-ws8ib.gcp.mongodb.net/UofT_Meals_API?retryWrites=true&w=majority';
      var db;
      mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true})
      .then(() => {
        db = mongoose.connection.db;
        for(var i = 0; i < 7; i++){
          db.collection(collection).deleteOne({});
        }
        for(var i = 0; i < 7; i++){
          db.collection(collection).insertOne(data[i]);
        }
      })
      .catch((err) => console.error(err));
    }
  
}

function clean(str){
  str = str.replace('"', "\"");
  str = str.replace("'", "\'");
  return str;
}

module.exports = Menu;