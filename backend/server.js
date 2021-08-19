const 
  express = require('express'),
  mongoose = require('mongoose'), 
  bodyParser = require('body-parser'),
  cors = require('cors');


require('dotenv').config();
  
const Workout = require('./api/models/workout');
const BodyMeasurement = require('./api/models/bodyMeasurement');
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose.connect(process.env.DATABASE_URL)
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
  origin: process.env.CORS_ORIGIN
};
app.use(cors(corsOptions));


let workoutRoutes = require('./api/routes/workoutRoutes'); 
workoutRoutes(app); 

let bodyMeasurementRoutes = require('./api/routes/bodyMeasurementRoutes'); 
bodyMeasurementRoutes(app); 

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}.`);
});