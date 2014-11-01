(function() {
  var app = angular.module('Test', []);

  app.controller('TestController', ['$scope', '$timeout', '$http', function($scope, $timeout, $http) {
      //Fields
      var registeredDirectives = [];
      var imageChanger = function(directiveToUpdate, $scope) {
        var changeImages = function() {
          try {
            if($scope.images !== "undefined") {
              var newImage = $scope.images[Math.floor(Math.random() * $scope.images.length)];
              directiveToUpdate.imageData = newImage;
              console.log("Updated " + directiveToUpdate + " to use " + newImage.src);

            }
          } catch (err) {
            //Ignore
          }
          $timeout(changeImages, Math.floor(1500 + Math.random() * 4000));
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
        , template: '<div style="border: 1px solid black"><img style="width: 100%" ng-src="{{imageData.src}}"</img><p>{{imageData.name}}</p></div>'
        , link: linkFunction
        , scope : true
      };
    }
  ]);
})();
