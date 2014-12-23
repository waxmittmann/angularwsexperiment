(function() {
  var debug = true;
  var app = angular.module('MainApp', []);

  app.controller('ImageRotatorController', ['$scope', '$timeout', '$http',
    function($scope, $timeout, $http) {
      //Fields
      var registeredDirectives = [];
      var registeredDirectivesByName = {};
      $scope.state = "initial";
      $scope.previousState = "initial";

      $scope.$watch('state', function() {
        console.log("State changed to '", $scope.state, "'");
        if($scope.state == $scope.previousState) {
          return;
        }
        $scope.previousState = $scope.state;
        if($scope.state == 'initial') {
          $scope.imageSwitcher.randomSwitcher($scope.images['initial'], 'initial');
        } else if($scope.state == 'question') {
          $scope.imageSwitcher.questionSwitcher($scope.images['question'], 'question');
        } else if($scope.state == 'answer') {
          $scope.imageSwitcher.answerSwitcher($scope.images['answer'], 'answer');
        } else {
          throw "Unknown state " + state;
        }
      });

      var getRandomImage = function(images) {
        return images[Math.floor(Math.random() * images.length)];
      }

      var imageSetup = function(images) {
          for(var i = 0; i < registeredDirectives.length; i++) {
            registeredDirectives[i].setup(getRandomImage(images), getRandomImage(images));
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
            if($scope.state != activeState) {
              //We stop
              console.log("Stopping because " + $scope.state + " is not " + activeState);
            } else if(imageOrder.length == 0) { //We go again
              console.log("All done with switches");
              $timeout(start, 500);
            } else { //We switch image
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

          function start() {
            var imageOrder = getImageOrder();
            executeImageSwitches(imageOrder);
          }

          start();

          // return {
          //   'switch': function() {
          //     var imageOrder = getImageOrder();
          //     executeImageSwitches(imageOrder);
          //   }
          // };
        };

        var questionSwitcher = function(images, activeState) {
          function createDirectiveImageObj(directiveName, image) {
            return {
              'directive': registeredDirectivesByName[directiveName],
              'image': image
            };
          }

          function getImageOrder() {
            console.log("Generating image order from ", images, " first is ", images['Will_0.png']);
            var imageOrder = [];
            imageOrder.push(createDirectiveImageObj('directive1', images['Will_0.png']));
            imageOrder.push(createDirectiveImageObj('directive2', images['Will_1.png']));
            imageOrder.push(createDirectiveImageObj('directive3', images['Will_2.png']));
            imageOrder.push(createDirectiveImageObj('directive4', images['Will_3.png']));
            return imageOrder;
          }


          function executeImageSwitches(imageOrder) {
            if(imageOrder.length == 0 || $scope.state != activeState) {
              console.log("All done with switches");
              //$timeout(changeImage, 500);
            } else {
              console.log("Switching");
              imageOrder[0].directive.changeImage(imageOrder[0].image);
              imageOrder.splice(0, 1);
              $timeout(
                function() {
                  executeImageSwitches(imageOrder);
                },
                500);
              }
          }

          function start() {
            var imageOrder = getImageOrder();
            executeImageSwitches(imageOrder);
          }
          start();

          // return {
          //   'switch': function() {
          //     var imageOrder = getImageOrder();
          //     executeImageSwitches(imageOrder);
          //   }
          // }
        };

        var answerSwitcher = function() {
          $timeout(changeImage, 100);
        };

        return {
          'questionSwitcher': questionSwitcher,
          'answerSwitcher': answerSwitcher,
          'randomSwitcher': randomSwitcher
        };

        // var changeImage = function() {
        //     console.log("ChangeImage with ", images);
        //     if($scope.state == 'initial') {
        //       randomSwitcher(images['initial'], 'initial').switch();
        //     } else if($scope.state == 'question') {
        //       questionSwitcher(images['question'], 'question').switch();
        //     } else if($scope.state == 'answer') {
        //       answerSwitcher('answer').switch();
        //     } else {
        //       $timeout(changeImage, 2000);
        //       throw "Bad state " + $scope.state;
        //     }
        // };
        // changeImage();
      };

      //Methods
      function createApi() {
        var idAt = 0;
        $scope.api = {
          registerForImages: function(directive) {
            if(debug)
              console.log("Registered " + directive + " with name " + directive.name + " and " + name);
            registeredDirectives.push(directive);
            registeredDirectivesByName[directive.name] = directive;
            return idAt++;
          }
        };
      }

      function loadImages() {
        $http.get('/images')
          .success(function(data, status, headers, config) {
            console.log("Got data ", data);
              $scope.images = data;
              console.log("Images are ",data['initial'], " ", data['question'])
              imageSetup($scope.images['initial']);
              $scope.imageSwitcher = imageSwitcher();
              $scope.imageSwitcher.randomSwitcher($scope.images['initial'], 'initial');
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
