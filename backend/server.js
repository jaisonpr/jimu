const 
  express = require('express'),
  mongoose = require('mongoose'), 
  bodyParser = require('body-parser');

const port = process.env.PORT || 3000;
const Workout = require('./api/models/workout');
  
mongoose.set('useUnifiedTopology', true);
const connect = mongoose.connect('mongodb://localhost:27017/jimu-db', { useNewUrlParser: true } );

connect.then((db) => {
  console.log('Connected correctly to database server');
});



const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/workoutRoutes'); 
routes(app); 

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);


console.log('RESTful API server started on: ' + port);
 