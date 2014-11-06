(function() {
  var app = angular.module('MainApp', []);

  app.controller('ImageRotatorController', ['$scope', '$timeout', '$http', function($scope, $timeout, $http) {
      //Fields
      var registeredDirectives = [];
      var registeredDirectiveRotation = {};
      var imageChanger = function(directiveToUpdate, $scope) {
        var changeImages = function() {
          try {
            if($scope.images !== "undefined") {

              var firstRun = typeof directiveToUpdate.imageData === "undefined";

              if(firstRun) {
                var newImage1 = getNewImage($scope.images, directiveToUpdate.imageData, directiveToUpdate.backImageData);
                var newImage2 = getNewImage($scope.images, directiveToUpdate.imageData, directiveToUpdate.backImageData);

                console.log("Initial flip");

                directiveToUpdate.imageData = newImage1;
                directiveToUpdate.backImageData = newImage2;
                $timeout(function() {
                  directiveToUpdate.extraClasses = "flip180";
                  console.log("Updated " + directiveToUpdate + " to use " + newImage1.src + " and " + newImage2.src);
                  $timeout(changeImages, getTimeToNext());
                }, getTimeToNext());
              } else if(directiveToUpdate.extraClasses === "flip180") {
                var newImage = getNewImage($scope.images, directiveToUpdate.imageData, directiveToUpdate.backImageData);
                console.log("Currently flipped, unflipping");
                directiveToUpdate.imageData = newImage;
                $timeout(function() {
                  directiveToUpdate.extraClasses = "";
                  console.log("Updated " + directiveToUpdate + " to use " + newImage.src);
                  $timeout(changeImages, getTimeToNext());
                }, getTimeToNext());
              } else {
                var newImage = getNewImage($scope.images, directiveToUpdate.imageData, directiveToUpdate.backImageData);
                console.log("Currently unflipped, flipping");
                directiveToUpdate.backImageData = newImage;
                $timeout(function() {
                  directiveToUpdate.extraClasses = "flip180";
                  console.log("Updated " + directiveToUpdate + " to use " + newImage.src);
                  $timeout(changeImages, getTimeToNext());
                }, getTimeToNext());
              }
            }
          } catch (err) {
            //Ignore
          }
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

      //Main stuff
      createApi();
      loadImages();

    }
  ]);

  app.directive('imageRotator', ['$timeout', function($timeout) {
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
