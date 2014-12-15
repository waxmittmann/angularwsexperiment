(function() {
  var debug = true;
  var app = angular.module('MainApp', []);

  app.controller('ImageRotatorController', ['$scope', '$timeout', '$http',
    function($scope, $timeout, $http) {
      //Fields
      var registeredDirectives = [];
      var registeredDirectiveRotation = {};
      $scope.state = "initial";

      // console.log("Here state is " + $scope.attrs.state);
      // $scope.$watch($scope.state, function (newState) {

      // $scope.$watch('state', function (newState) {
      //   console.log("Got state update, it is ", newState, " and ", $scope.state);
      //   $scope.state = newState;
      // });

      var imageSwitcher = function() {
        var randomSwitcher = (function() {
          function getRandomDirective() {
            var at = Math.floor(Math.random() * registeredDirectives.length);
            console.log("Got " + at + " with length of " + registeredDirectives.length);
            return registeredDirectives[at];
          }

          return {
            'switch': function() {
              var image = $scope.images[Math.floor(Math.random() * $scope.images.length)];
              getRandomDirective().changeImage(image);
            }
          };
        })();

        var questionSwitcher = (function() {

        })();

        var answerSwitcher = (function() {

        }());

        var changeImage = function() {
            console.log("ChangeImage");
            if($scope.state == 'initial') {
              randomSwitcher.switch();
              $timeout(changeImage, 500);
            } else if($scope.state == 'question') {
              questionSwitcher.switch();
              $timeout(changeImage, 100);
            } else if($scope.state == 'answer') {
              answerSwitcher.switch();
              $timeout(changeImage, 100);
            } else {
              $timeout(changeImage, 2000);
              throw "Bad state " + $scope.state;
            }
        };
        changeImage();
      };

      /*
      var randomImageChanger = function(directiveToUpdate, $scope) {
        var newImageA = getNewImage($scope.images, directiveToUpdate.imageDataA, directiveToUpdate.imageDataB);
        var newImageB = getNewImage($scope.images, directiveToUpdate.imageDataA, directiveToUpdate.imageDataB);
        directiveToUpdate.setup(newImageA, newImageB);

        function getNewImage(images, curFrontImage, curBackImage) {
          var newImage = images[Math.floor(Math.random() * images.length)];
          while(newImage == curFrontImage || newImage == curBackImage) {
            newImage = images[Math.floor(Math.random() * images.length)];
          }
          return newImage;
        }

        function getTimeToNext() {
          return Math.floor(2000 + Math.random() * 2000);
        }

        var changeImages = function() {
          if(debug)
            console.log("ChangeImages called");
          try {
            if($scope.images !== "undefined") {
              if(debug)
                console.log("Pre-change");
              var newImage = getNewImage($scope.images, directiveToUpdate.imageDataA, directiveToUpdate.imageDataB);
              directiveToUpdate.changeImage(newImage);
              $timeout(changeImages, getTimeToNext());
            }
          } catch (err) {
            console.log(err);
          }
        };
        changeImages();
      };*/

      //Methods
      function createApi() {
        var idAt = 0;
        $scope.api = {
          registerForImages: function(directive) {
            if(debug)
              console.log("Registered " + directive);
            registeredDirectives.push(directive);
            // if($scope.images) {
            //   randomImageChanger(directive, $scope);
            // }
            return idAt++;
          }
        };
      }

      function loadImages() {
        $http.get('/images')
          .success(function(data, status, headers, config) {
              $scope.images = data;
              // for(var i = 0; i < registeredDirectives.length; i++) {
              //   imageChanger(registeredDirectives[i], $scope);
              // }
              imageSwitcher();
              if(debug)
                console.log("Had success with " + data);
          }).
          error(function(data, status, headers, config) {
            throw "Had error with status: " + status;
          });
      }

      //Main stuff
      createApi();
      loadImages();
    }
  ]);
})();
