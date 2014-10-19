var app = angular.module('TemplateApp', []);

app.controller('SimpleController', [
  '$scope', function($scope) {
    $scope.title = "Hello Angular";
    $scope.name = "Max";
    $scope.sayHello = function() {
      $scope.greeting = "Hello " + $scope.name;
    }
  }
]);

app.directive('helloWorld', function() {
  return {
      restrict: 'AE',
      replace: 'true',
      template: '<h3>Hello World!!</h3>'
  };
});

app.directive('yellowBird', function() {
  return {
      restrict: 'AE',
      replace: 'true',
      templateUrl: './resources/partials/yellowBird.html'
  };
});

app.directive('imageRotator', function() {
  return {
      restrict: 'AE',
      replace: 'true',
      templateUrl: './resources/partials/image.html',
      scope: {
        image: '=image'
      }
  };
});

app.controller('ImageController', ['$scope', function($scope) {
    // $scope.imageA = {
    //     'name': 'ImageA',
    //     'src': './resources/images/hello.png'
    // };
    // $scope.imageB = {
    //     'name': 'ImageB',
    //     'src': './resources/images/hello.png'
    // };

    $scope.images = [];
    $scope.images[0] = {
        'name': 'ImageA',
        'src': './resources/images/hello.png'
    };
    $scope.images[1] = {
        'name': 'ImageB',
        'src': './resources/images/hello.png'
    };

}]);

app.controller('RotatingImageController', ['$scope', '$http',
  function($scope, $http) {
    $scope.images = [];
    $http.get('/images')
      .success(function(data, status, headers, config) {
          // console.log("Got " + data);
          // var imageData = JSON.parse(data);
          // var imageData = data;
          $scope.images = data;
          console.log("Had success with " + data);

          /*
          $scope.$apply();
          if(!$scope.$$phase) {
            //$digest or $apply
            console.log("Digesting...");
            $scope.$digest();
          }*/
      }).
      error(function(data, status, headers, config) {
        throw "Had error with status: " + status;
      });
  }
]);

app.directive('rotatingImage', [function() {
  var localScope = {};

  var linkFunction = function(scope, element, attributes) {
    console.log("Attributses id: " + attributes["id"]);
    localScope.id = attributes["id"];
    scope.image = scope.images[localScope.id];
    console.log("Initially got " + scope.image);
      scope.$watch('images', function(newValue, oldValue) {
      // scope.$watch(scope.images, function(newValue, oldValue) {

      // if(scope !== undefined && !scope.hasOwnProperty('image')) {
      //   throw "Do not want to override inheriting property";
      // }
        scope.image = scope.images[localScope.id];
      // localScope.image = scope.images[localScope.id];
        console.log("Watched and got " + scope.images + "\n and: " + scope.image);
    });
  };

  return {
      restrict: 'AE'
      , replace: 'true'
      , templateUrl: './resources/partials/image.html'
      , link: linkFunction
      , scope: true
      //, scope: {
        // image: localScope.image,
      //}
  };
}]);
