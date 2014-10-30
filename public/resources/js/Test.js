(function() {
  var app = angular.module('Test', []);

  function printScopes(scope) {
    console.log("Scope:");
    for(item in scope) {
      if(scope.hasOwnProperty(item)) {
        console.log(item + ": " + scope[item]);
      }
    }
    console.log("\n\nParent Scope:");
    for(item in scope.$parent) {
      if(scope.$parent.hasOwnProperty(item)) {
        console.log(item + ": " + scope[item]);
      }
    }
  }

  app.controller('TestController', ['$scope', '$timeout', '$http', function($scope, $timeout, $http) {
      var registered = {};
      var registeredDirectives = [];
      var idAt = 0;

      var imageChanger = function(directiveToUpdate, $scope) {
        var changeImages = function() {
          console.log("Have: " + directiveToUpdate + " and " + $scope);
          try {
            if($scope.images !== "undefined") {
              //Get random image
              var newImage = $scope.images[Math.floor(Math.random() * $scope.images.length)];
              //Change the image of the displayer to a random image
              directiveToUpdate.imageData = newImage;
              // directiveToUpdate.callMe();
              console.log("Updated " + directiveToUpdate + " to use " + newImage.src);

            }
          } catch (err) {
            //Ignore
          }
          //Set timeout for next image
          $timeout(changeImages, Math.floor(1500 + Math.random() * 4000));
        };
        changeImages();
      };

      $scope.api = {
        registerForImages: function(directive) {
          console.log("Registered " + directive);
          registeredDirectives.push(directive);
          registered[idAt] = 0;
          if($scope.images) {
            imageChanger(directive, $scope);
          }
          return idAt++;
        }
      };

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
  ]);

  app.directive('testDirective', ['$timeout', function($timeout) {
      var that = this;

      var linkFunction = function(scope, element, attrs) {
        printScopes(scope);

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
