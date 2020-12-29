const 
  express = require('express'),
  mongoose = require('mongoose'), 
  bodyParser = require('body-parser'),
  cors = require('cors');

  
const Workout = require('./api/models/workout');
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose.connect('mongodb://mongo:27017/jimu-db')
  .then((db) => {
    console.log('Connected correctly to database server');
  })
  .catch(err => {
    console.log("Can't connect to the database!", err);
    console.error(err);
    process.exit();
  });


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const corsOptions = {
  origin: "http://localhost:4200"
};
app.use(cors(corsOptions));


var routes = require('./api/routes/workoutRoutes'); 
routes(app); 

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});