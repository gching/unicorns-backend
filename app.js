var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');


// Routes import
var users = require('./routes/users');
var transactions = require('./routes/transactions');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// Versioning
var VERSIONS = {
  'version0': '/v0'
};

// Route to display versions
app.get('/', function (req, res){
  res.json(VERSIONS);
});

// versioned routes go in the routes/ directory
// import the routes
for (var k in VERSIONS) {
    app.use(VERSIONS[k], require('./routes/' + k));
}
/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});


module.exports = app;
