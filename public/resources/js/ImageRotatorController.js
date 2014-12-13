(function() {
  var app = angular.module('MainApp', []);

  app.controller('ImageRotatorController', ['$scope', '$timeout', '$http',
    function($scope, $timeout, $http) {
      //Fields
      var registeredDirectives = [];
      var registeredDirectiveRotation = {};

      $scope.$watch($scope.state, function (newState) {
        console.log("Got state update, it is ", newState);
        $scope.state = newState;
      });

      var imageChanger = function(directiveToUpdate, $scope) {
        var newImageA = getNewImage($scope.images, directiveToUpdate.imageDataA, directiveToUpdate.imageDataB);
        var newImageB = getNewImage($scope.images, directiveToUpdate.imageDataA, directiveToUpdate.imageDataB);
        directiveToUpdate.setup(newImageA, newImageB);
        directiveToUpdate.changeImage(newImageA);
        directiveToUpdate.changeImage(newImageA);
        directiveToUpdate.changeImage(newImageA);
        
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
          console.log("ChangeImages called");
          try {
            if($scope.images !== "undefined") {
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
