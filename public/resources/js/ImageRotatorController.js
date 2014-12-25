(function() {
  var debug = true;
  var app = angular.module('MainApp', []);

  app.controller('ImageRotatorController', ['$scope', '$timeout', '$http',
    function($scope, $timeout, $http) {
      //Fields
      var registeredDirectives = [];
      var registeredDirectivesByName = {};
      $scope.state = "unset";
      $scope.previousState = "unset";

      $scope.$watch('state', function() {
        console.log("State changed to '", $scope.state, "'");
        switchByState();
      });

      var switchByState = function() {
        if($scope.state == $scope.previousState) {
          console.log("State ", $scope.state, " unchanged");
          return;
        }
        $scope.previousState = $scope.state;
        if($scope.state == 'initial') {
          console.log("State changed to initial");
          $scope.imageSwitcher.randomSwitcher($scope.images['initial'], 'initial');
        } else if($scope.state == 'question') {
          console.log("State changed to question");
          $scope.imageSwitcher.questionSwitcher($scope.images['question'], 'question');
        } else if($scope.state == 'answer') {
          console.log("State changed to answer");
          $scope.imageSwitcher.answerSwitcher($scope.images['answer'], 'answer');
        } else {
          throw "Unknown state " + state;
        }
      }

      var getRandomImage = function(images) {
        return images[Math.floor(Math.random() * images.length)];
      }

      var imageSetup = function(images) {
          for(var i = 0; i < registeredDirectives.length; i++) {
            var front = getRandomImage(images);
            var back = getRandomImage(images);
            console.log("Setting registered directive ", i, " to ", front.src);
            registeredDirectives[i].setup(front, back);
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
            var at = 1;
            imageOrder.push(createDirectiveImageObj('directive4_1', images['Will_0.png']));
            imageOrder.push(createDirectiveImageObj('directive4_2', images['Will_1.png']));
            imageOrder.push(createDirectiveImageObj('directive4_3', images['Will_2.png']));
            imageOrder.push(createDirectiveImageObj('directive4_4', images['Will_3.png']));

            imageOrder.push(createDirectiveImageObj('directive1_5', images['You_0.png']));
            imageOrder.push(createDirectiveImageObj('directive2_5', images['You_1.png']));
            imageOrder.push(createDirectiveImageObj('directive3_5', images['You_2.png']));

            imageOrder.push(createDirectiveImageObj('directive1_1', images['Marry_0.png']));
            imageOrder.push(createDirectiveImageObj('directive1_2', images['Marry_1.png']));
            imageOrder.push(createDirectiveImageObj('directive1_3', images['Marry_2.png']));
            imageOrder.push(createDirectiveImageObj('directive1_4', images['Marry_3.png']));
            // imageOrder.push(createDirectiveImageObj('directive1_5', images['Marry_4.png']));

            imageOrder.push(createDirectiveImageObj('directive2_2', images['Me_0.png']));
            imageOrder.push(createDirectiveImageObj('directive3_2', images['Me_1.png']));

            imageOrder.push(createDirectiveImageObj('directive2_1', images['heart.jpg']));
            imageOrder.push(createDirectiveImageObj('directive3_1', images['heart.jpg']));

            imageOrder.push(createDirectiveImageObj('directive4_5', images['heart.jpg']));
            imageOrder.push(createDirectiveImageObj('directive4_6', images['heart.jpg']));
            imageOrder.push(createDirectiveImageObj('directive3_6', images['heart.jpg']));
            imageOrder.push(createDirectiveImageObj('directive2_6', images['heart.jpg']));
            imageOrder.push(createDirectiveImageObj('directive1_6', images['heart.jpg']));

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
        };

        var answerSwitcher = function(images, activeState) {
          function createDirectiveImageObj(directiveName, image) {
            return {
              'directive': registeredDirectivesByName[directiveName],
              'image': image
            };
          }

          function getImageOrder() {
            console.log("Generating image order from ", images, " first is ", images['Will_0.png']);
            var imageOrder = [];
            imageOrder.push(createDirectiveImageObj('directive1_1', images['Yes_0.png']));
            imageOrder.push(createDirectiveImageObj('directive1_2', images['Yes_1.png']));
            imageOrder.push(createDirectiveImageObj('directive1_3', images['Yes_2.png']));
            imageOrder.push(createDirectiveImageObj('directive1_4', images['ExclamationMark.png']));

            imageOrder.push(createDirectiveImageObj('directive2_6', images['Shi.png']));
            imageOrder.push(createDirectiveImageObj('directive3_6', images['ExclamationMark.png']));

            imageOrder.push(createDirectiveImageObj('directive4_3', images['Ja_0.png']));
            imageOrder.push(createDirectiveImageObj('directive4_4', images['Ja_1.png']));
            imageOrder.push(createDirectiveImageObj('directive4_5', images['ExclamationMark.png']));

            imageOrder.push(createDirectiveImageObj('directive3_1', images['Heart0_0.png']));
            imageOrder.push(createDirectiveImageObj('directive3_2', images['Heart0_1.png']));
            imageOrder.push(createDirectiveImageObj('directive4_2', images['Heart1_1.png']));
            imageOrder.push(createDirectiveImageObj('directive4_1', images['Heart1_0.png']));

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
          };

        // var start = function() {
        //   $scope.imageSwitcher.randomSwitcher($scope.images['initial'], 'initial');
        //   switchByState();
        // }

        return {
          'questionSwitcher': questionSwitcher,
          'answerSwitcher': answerSwitcher,
          'randomSwitcher': randomSwitcher
        };
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

      var getState = function(next) {
        console.log("get state called");
        $http.get('/state')
        .success(function(data) {
          console.log("get state executed, got ", data);
          $scope.state = data['state'];
          switchByState();
          // $scope.$digest();
          // next();
        })
        .error(function(data, status, headers, config) {
          throw "Had error with status: " + status;
        });
      }

      var getImages = function(next) {
        console.log("get images called");
        $http.get('/images')
        .success(function(data, status, headers, config) {
          console.log("get images executed");
          console.log("Got data ", data);
            $scope.images = data;
            console.log("Images are ",data['initial'], " ", data['question'])
            imageSetup($scope.images['initial']);
            $scope.imageSwitcher = imageSwitcher();
            // $scope.imageSwitcher.start();
            // $scope.imageSwitcher.randomSwitcher($scope.images['initial'], 'initial');
            // switchByState();
            if(debug) {
              console.log("Had success with " + data);
            }
            next();
          }
          )
          .error(function(data, status, headers, config) {
            throw "Had error with status: " + status;
          });
      }


      function setup() {
        console.log("Setup called");
        getImages(getState);
        // getState(getImages);

      //   $http.get('/state')
      //     .success()
      //     error(function(data, status, headers, config) {
      //       throw "Had error with status: " + status;
      //     });
      //
      //   $http.get('/images')
      //     .success(function(data, status, headers, config) {
      //       console.log("Got data ", data);
      //         $scope.images = data;
      //         console.log("Images are ",data['initial'], " ", data['question'])
      //         imageSetup($scope.images['initial']);
      //         $scope.imageSwitcher = imageSwitcher();
      //         $scope.imageSwitcher.randomSwitcher($scope.images['initial'], 'initial');
      //         if(debug)
      //           console.log("Had success with " + data);
      //     }).
      //     error(function(data, status, headers, config) {
      //       throw "Had error with status: " + status;
      //     });
      }

      //Main stuff
      createApi();
      setup();
    }
  ]);
})();
