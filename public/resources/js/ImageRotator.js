(function() {
  var app = angular.module('Test', []);

  app.controller('TestController', ['$scope', '$timeout', '$http', function($scope, $timeout, $http) {
      //Fields
      var registeredDirectives = [];
      var registeredDirectiveRotation = {};
      var imageChanger = function(directiveToUpdate, $scope) {
        var changeImages = function() {
          try {
            if($scope.images !== "undefined") {
              var newImage = $scope.images[Math.floor(Math.random() * $scope.images.length)];
              while(newImage == directiveToUpdate.imageData || newImage == directiveToUpdate.backImageData) {
                newImage = $scope.images[Math.floor(Math.random() * $scope.images.length)];
              }

              var firstRun = typeof directiveToUpdate.imageData === "undefined";

              if(firstRun) {
                directiveToUpdate.imageData = newImage;
              } else {
                directiveToUpdate.imageData = directiveToUpdate.backImageData;
              }
              directiveToUpdate.backImageData = newImage;

              if(!firstRun) {
                directiveToUpdate.extraClasses = "flipper2"
                $timeout(function() {
                  directiveToUpdate.extraClasses = ""
                }, 1500);
              }

              // if(directiveToUpdate.extraClasses === "flipper2") {
              //   directiveToUpdate.extraClasses = "";
              // } else {
              //   directiveToUpdate.extraClasses = "flipper2";
              // }

              directiveToUpdate.imageStyle = {'transform': 'rotate(' + rotateAmount + 'deg)'};
              console.log("Updated " + directiveToUpdate + " to use " + newImage.src);
            }
          } catch (err) {
            //Ignore
          }
          $timeout(changeImages, Math.floor(3000 + Math.random() * 4000));
        };
        changeImages();
      };

      //Methods
      function createApi() {
        var idAt = 0;
        $scope.api = {
          registerForImages: function(directive) {
            console.log("Registered " + directive);
            registeredDirectives.push(directive);
            if($scope.images) {
              imageChanger(directive, $scope);
            }
            return idAt++;
          }
        };
      }

      function loadImages() {
        $http.get('/images')
          .success(function(data, status, headers, config) {
              $scope.images = data;
              for(var i = 0; i < registeredDirectives.length; i++) {
                imageChanger(registeredDirectives[i], $scope);
              }
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

  app.directive('testDirective', ['$timeout', function($timeout) {
      var linkFunction = function(scope, element, attrs) {
        scope.changeImage = function(imageData) {
          console.log("Changed to " + imageData);
          scope.imageData = imageData;
        }
        scope.id = scope.api.registerForImages(scope.this);
      }

      return {
        restrict: 'AE'
        , replace: 'true'
        , templateUrl: './resources/partials/imageRotatorPartial.html'
        , link: linkFunction
        , scope : true
      };
    }
  ]);
})();
