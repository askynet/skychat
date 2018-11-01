// Bring in our dependencies
const app = require('express')();
const bodyParser=require('body-parser');
const mongoose = require('mongoose');


const routes = require('./routes');
const PORT = process.env.PORT || 2019;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/skychat');
mongoose.connection.on('error', function(err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
});


app.use(bodyParser.json({limit: '50mb'}));

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

//  Connect all our routes to our application
app.use('/', routes);

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});
// Turn on that server!
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
