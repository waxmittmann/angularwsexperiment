(function() {
  var debug = true;
  var app = angular.module('MainApp');

  app.directive('imageRotator', ['$timeout', function($timeout) {
    var linkFunction = function(scope, element, attrs) {
      scope.facingSide = "front";

      scope.changeImage = function(imageData) {

        if(scope.facingSide === "front") {
          if(debug)
            console.log("Setting front ", scope.id, " to ", imageData);
          scope.imageDataB = imageData.src;
          scope.facingSide = "back";
          scope.extraClasses = "flip180";
        } else {
          if(debug)
            console.log("Setting back ", scope.id, " to ", imageData);
          scope.imageDataA = imageData.src;
          scope.facingSide = "front";
          scope.extraClasses = "";
        }
      };

      scope.setup = function(imageDataA, imageDataB) {
        if(debug)
          console.log("Initial ", scope.id, " to ", imageDataA, " and ", imageDataB);
        scope.imageDataA = imageDataA.src;
        scope.imageDataB = imageDataB.src;
        scope.facingSide = "front";
      };

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
