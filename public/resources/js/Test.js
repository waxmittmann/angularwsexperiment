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
              directiveToUpdate.imageData = newImage;
              var rotateAmount = registeredDirectiveRotation[directiveToUpdate];
              rotateAmount++;
              if(rotateAmount > 360)
                rotateAmount = 0;
              registeredDirectiveRotation[directiveToUpdate] = rotateAmount;
              // directiveToUpdate.rotateAmount = 45;
              directiveToUpdate.imageStyle = {'transform': 'rotate(' + rotateAmount + 'deg)'};
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
            registeredDirectiveRotation[directive] = 0;
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
          scope.rotateAmount = 130;
        }
        scope.id = scope.api.registerForImages(scope.this);
      }

      return {
        restrict: 'AE'
        , replace: 'true'
        // , template: '<div ng-style="{\'transform\': \'rotate(\'{{rotateAmount}}deg\')\', \'-webkit-transform\': \'rotate(\'+{{rotateAmount}}+\'deg)\', \'-ms-transform\': \'rotate(\'{{rotateAmount}+\'deg)\'}" style="border: 1px solid black"><img style="width: 100%" ng-src="{{imageData.src}}"</img><p>{{imageData.name}}</p></div>'
        // , template: '<div ng-style={\'background-color\': \'red\', \'transform\': \'rotate({{rotateAmount}}deg)\'} style="border: 1px solid black"><img style="width: 100%" ng-src="{{imageData.src}}"</img><p>{{imageData.name}}</p></div>'
        , template: '<div ng-style="imageStyle" style="border: 1px solid black"><img style="width: 100%" ng-src="{{imageData.src}}"</img><p>{{imageData.name}}</p></div>'
        , link: linkFunction
        , scope : true
      };
    }
  ]);
})();
