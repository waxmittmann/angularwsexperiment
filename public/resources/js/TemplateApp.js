var app = angular.module('TemplateApp', ['Test']);

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
