const express = require('express');
const app = express();
const port = 3000;
const sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const session = require('express-session');
app.use(session({
  secret: 'author',
  resave: false,
  saveUninitialized: true,
}));

//items in the global namespace are accessible throught out the node application
global.db = new sqlite3.Database(__dirname+'/database.db',function(err){
  if(err){
    console.error(err);
    process.exit(1); //Bail out we can't connect to the DB
  }else{
    console.log("Database connected");
    global.db.run("PRAGMA foreign_keys=ON"); //This tells SQLite to pay attention to foreign key constraints
  }
});

//set the app to use ejs for rendering
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile)  //allows rendering of HTML pages with EJS

//gets logo image
app.get('/logo.png', (req, res) => {
  res.sendFile(__dirname + '/logo.png')
});

//gets css file, CSS file reused from my WEBDEV final submission
app.get('/style.css', (req, res) => {
  res.sendFile(__dirname + '/style.css')
});

//this adds all the ROUTES to the app under the path /
const routes = require('./routes/routes');
app.use('/', routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
