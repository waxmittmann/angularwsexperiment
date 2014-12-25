var express = require('express');
var app = express();
var favicon = require('serve-favicon');
var fs = require('fs');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var q = require('q');
var path = require('path');

function readImageDirAsArray(publicPath, imagePath) {
  var deferred = q.defer();
  fs.readdir(__dirname + publicPath + imagePath, function(err, filenames) {
    if(err)
    {
      console.log("Error is ", err);
      q.reject(err);
      // throw err;
    }
    var subImages = [];
    for(var i = 0; i < filenames.length; i++) {
      subImages.push({
        'src': imagePath + filenames[i],
        'name': filenames[i]
      });
    }
    console.log("SubImages ", filenames.length);
    deferred.resolve(subImages);
    // return subImages;
  });
  return deferred.promise;
}

function readImageDirAsMap(publicPath, imagePath) {
  var deferred = q.defer();
  fs.readdir(__dirname + publicPath + imagePath, function(err, filenames) {
    if(err)
      {
        console.log("Error is ", err);
        q.reject(err);
        // throw err;
      }
      var subImages = {};
      for(var i = 0; i < filenames.length; i++) {
        subImages[filenames[i]] = {
          'src': imagePath + filenames[i],
          'name': filenames[i]
        };
      }
      console.log("SubImages ", filenames.length);
      deferred.resolve(subImages);
      // return subImages;
    });
    return deferred.promise;
}

//Init image stuff
app.get('/images', function(req, res) {
    console.log("Image called");
    res.setHeader('Content-Type', 'application/json');

    var imagesJSON = {};
    var initialPromise = readImageDirAsArray('/public/', 'resources/images/initialImages/');
    var questionPromise = readImageDirAsMap('/public/', 'resources/images/questionImages/');
    var answerPromise = readImageDirAsMap('/public/', 'resources/images/answerImages/');

    var promise = q.all([initialPromise, questionPromise, answerPromise]);
    promise.spread(function(initialImages, questionImages, answerImages) {
      console.log("Imgs: ", initialImages, " ", questionImages);
      imagesJSON['initial'] = initialImages;
      imagesJSON['question'] = questionImages;
      imagesJSON['answer'] = answerImages;
      console.log("Pre-done");
      console.log("ImagesJson is " + imagesJSON);
      res.end(JSON.stringify(imagesJSON));
    });
});

//Websocket stuff
// (function() {
var state = 'initial';

app.get('/state', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  var curState = {
    'state': state
  };
  res.end(JSON.stringify(curState));
});

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('stateChange', function(msg) {
    console.log("Got stateChange ", msg);
    state = msg;
    io.emit('stateChange', msg);
  });
});
// })();

app.use('/resources', express.static(__dirname + '/public/resources'));

//ROUTING
// app.use('/', express.static(__dirname + '/public/static'));
// app.use('/finalLayout_v9.html', express.static(__dirname + '/public/static'));

app.set('view engine', 'jade');
app.set('views', __dirname + "/public/jade/");
// app.use(app.router);
app.all('*', function (req, res) {
  console.log("Trying to render ", req.url + ".jade");
  // res.render("./public/jade" + req.url, { title : 'Home' })
  res.render("./" + req.url + ".jade", { title : 'Home' }
  , function(err, html) {
    console.log("Error: ", err);
    console.log("Html : ", html);
    res.end(html);
  });
  console.log("Post-render");
});

/*app.get('/index', function (req, res) {
  console.log("Trying to render ", req.url);
  // res.render("./public/jade" + req.url, { title : 'Home' })
  res.render("./index.jade", { title : 'Home' });
  // , function(err, html) {
  //   console.log("Error: ", err);
  //   console.log("Html : ", html);
  //
  // });
  console.log("Post-render");
});*/

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
    var err = new Error('Not Found: ' + req.url);
    err.status = 404;
    next(err);
});

http.listen(8000);

console.log("Server is running on 8000");
module.exports = app;
