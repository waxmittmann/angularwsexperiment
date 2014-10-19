var express = require('express');
var app = express();
// var logger = require('morgan');
var favicon = require('serve-favicon');
// var path = require('path');
// var router = express.Router();

//app.use(express.static(__dirname + '/public'));

//ROUTING
(function() {
  var imgAt = 0;

  app.get('/images', function(req, res) {
    console.log("Image called");
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify([
      {
        'src': './resources/images/a.png',
        'name': 'AImage'
      }
      ,{
        'src': './resources/images/b.png',
        'name': 'BImage'
      }
      ,{
        'src': './resources/images/c.png',
        'name': 'CImage'
      }
    ]));
  });
})();

app.use('/', express.static(__dirname + '/public/static'));

app.use('/resources', express.static(__dirname + '/public/resources'));

/// error handlers
app.use(function(err, req, res, next) {
  if (app.get('env') === 'development') {
    app.use(developmentErrorHandler);
  } else {
    app.use(productionErrorHandler);
  }
});

function productionErrorHandler(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
}

function developmentErrorHandler(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
}

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


app.listen(8000);
console.log("Server is running on 8000");
module.exports = app;
