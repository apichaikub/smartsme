var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var config_mongodb = require('./config/database.js');
var port 		   = process.env.PORT || 3000;
var pretty         = require('express-prettify');

// configuration
mongoose.connect(config_mongodb.url); // connect to our database

// set up our express application
app.use(express.static(__dirname + '/public')); // set public path

app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({ // get information from html forms and limit request size
	extended: true,
	limit: '50mb',
	parameterLimit: 500
}));

// middleware to send pretty printed json
// you can use like this: curl http://localhost:3000?pretty
app.use(pretty({ query: 'pretty' }));




// Restful API
app.use('/api/v1', require('./app/routes/v1'));
app.use('/api/v2', require('./app/routes/v2'));




// launch for localhost
app.listen(port);
console.log('The magic happens on port ' + port);





