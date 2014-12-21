(function() {
  var debug = true;
  var app = angular.module('MainApp', []);

  app.controller('ImageRotatorController', ['$scope', '$timeout', '$http',
    function($scope, $timeout, $http) {
      //Fields
      var registeredDirectives = [];
      var registeredDirectiveRotation = {};
      $scope.state = "initial";

      var getRandomImage = function() {
        return $scope.images[Math.floor(Math.random() * $scope.images.length)];
      }

      var imageSetup = function() {
          for(var i = 0; i < registeredDirectives.length; i++) {
            registeredDirectives[i].setup(getRandomImage(), getRandomImage());
          }
      };

      var imageSwitcher = function() {
        var randomSwitcher = function(images, activeState) {
          function getImageOrder() {
            console.log("Getting image order");
            var directivesLeft = registeredDirectives.slice(0);
            var imageOrder = [];
            while(directivesLeft.length > 0) {
              var at = Math.floor(Math.random() * directivesLeft.length);
              imageOrder.push(directivesLeft[at]);
              directivesLeft.splice(at, 1);
            }
            console.log("Image order that will be returned is ", imageOrder);
            return imageOrder;
          }

          function executeImageSwitches(imageOrder) {
            console.log("Executing image switches with order: ", imageOrder, ". Total directives: ", registeredDirectives.length);
            if(imageOrder.length == 0 || $scope.state != activeState) {
              console.log("All done with switches");
              $timeout(changeImage, 500);
            } else {
              console.log("Switching");
              var image = images[Math.floor(Math.random() * images.length)];
              imageOrder[0].changeImage(image);
              imageOrder.splice(0, 1);
              $timeout(
                function() {
                  executeImageSwitches(imageOrder);
                },
                500);
            }
          }

          return {
            'switch': function() {
              var imageOrder = getImageOrder();
              executeImageSwitches(imageOrder);
            }
          };
        };

        var questionSwitcher = function() {
          function executeImageSwitches() {
            $timeout(executeImageSwitches, 100);
          }

          return {
            'switch': function() {
              executeImageSwitches();
            }
          }
        };

        var answerSwitcher = function() {
          $timeout(changeImage, 100);
        };

        var changeImage = function() {
            console.log("ChangeImage");
            if($scope.state == 'initial') {
              randomSwitcher($scope.images['initial'], 'initial').switch();
            } else if($scope.state == 'question') {
              questionSwitcher($scope.images['question'], 'question').switch();
            } else if($scope.state == 'answer') {
              answerSwitcher('answer').switch();
            } else {
              $timeout(changeImage, 2000);
              throw "Bad state " + $scope.state;
            }
        };
        changeImage();
      };

      //Methods
      function createApi() {
        var idAt = 0;
        $scope.api = {
          registerForImages: function(directive) {
            if(debug)
              console.log("Registered " + directive);
            registeredDirectives.push(directive);
            return idAt++;
          }
        };
      }

      function loadImages() {
        $http.get('/images')
          .success(function(data, status, headers, config) {
              $scope.images = data;
              imageSetup();
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
