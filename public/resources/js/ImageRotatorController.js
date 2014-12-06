(function() {
  var app = angular.module('MainApp', []);

  app.controller('ImageRotatorController', ['$scope', '$timeout', '$http', function($scope, $timeout, $http) {
      //Fields
      var registeredDirectives = [];
      var registeredDirectiveRotation = {};
      
      var imageChanger = function(directiveToUpdate, $scope) {
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

        function flipToNext(directiveToUpdate, newImage) {
          var extraClasses;
          if(directiveToUpdate.currentlyFlipped) {
              directiveToUpdate.imageData = newImage;
              extraClasses = "";
          } else {
              directiveToUpdate.backImageData = newImage;
              extraClasses = "flip180";
          }
          setupTimeoutForNextFlip(directiveToUpdate, extraClasses);
        }

        function setupInitialFlip(directiveToUpdate, frontImage, backImage) {
          console.log("Initial flip");
          directiveToUpdate.imageData = frontImage;
          directiveToUpdate.backImageData = backImage;
          directiveToUpdate.currentlyFlipped = false;
          var extraClasses = "flip180";
          setupTimeoutForNextFlip(directiveToUpdate, extraClasses);
        }

        function setupTimeoutForNextFlip(directiveToUpdate, extraClasses) {
          $timeout(function() {
            directiveToUpdate.currentlyFlipped = !directiveToUpdate.currentlyFlipped;
            directiveToUpdate.extraClasses = extraClasses;
            $timeout(changeImages, getTimeToNext());
          }, getTimeToNext());
        }

        var changeImages = function() {
          try {
            if($scope.images !== "undefined") {
              var firstRun = typeof directiveToUpdate.imageData === "undefined";
              if(firstRun) {
                var newImage1 = getNewImage($scope.images, directiveToUpdate.imageData, directiveToUpdate.backImageData);
                var newImage2 = getNewImage($scope.images, directiveToUpdate.imageData, directiveToUpdate.backImageData);
                setupInitialFlip(directiveToUpdate, newImage1, newImage2);
              } else {
                var newImage = getNewImage($scope.images, directiveToUpdate.imageData, directiveToUpdate.backImageData);
                flipToNext(directiveToUpdate, newImage);
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

      //Main stuff
      createApi();
      loadImages();
    }
  ]);
})();
