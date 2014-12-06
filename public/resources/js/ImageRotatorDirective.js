(function() {
  var app = angular.module('MainApp');

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
