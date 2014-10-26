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
      var idAt = 0;
      var getNextImage = function(images, id) {
        if(registered[id] >= images.length) {
          registered[id] = 0;
        }
        return images[registered[id]++];
      };

      $scope.api = {
        getNewImage: function(id) {
          if (typeof $scope.images != 'undefined') {
            return getNextImage($scope.images, id)
          } else {
            return "";
          }
        },
        registerForImages: function() {
          registered[idAt] = 0;
          return idAt++;
        }
      };

      $http.get('/images')
        .success(function(data, status, headers, config) {
            $scope.images = data;
            console.log("Had success with " + data);
        }).
        error(function(data, status, headers, config) {
          throw "Had error with status: " + status;
        });
    }
  ]);

  app.directive('testDirective', ['$timeout', function($timeout) {
      var linkFunction = function(scope, element, attrs) {
        printScopes(scope);

        var parentScope = scope.$parent;
        scope.id = parentScope.api.registerForImages();
        var changeImages = function() {
          console.log("Changing images for " + scope.id);
          var newImage = parentScope.api.getNewImage(scope.id);
          if(newImage !== "") {
            console.log("Changing to " + newImage);
            scope.imageData = newImage;
          } else {
            console.log("Didn't get image data");
          }
          $timeout(changeImages, 2000);
        };
        $timeout(changeImages, 2000);
      }

      return {
        restrict: 'AE'
        , replace: 'true'
        , template: '<div style="border: 1px solid black"><h1>Test Directive</h1><img ng-src="{{imageData.src}}"</img><p>{{imageData.name}}</p></div>'
        , link: linkFunction
        , scope: true
      };
    }
  ]);
})();
