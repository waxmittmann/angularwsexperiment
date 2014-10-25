var app = angular.module('Test', []);

app.controller('TestController', ['$scope', '$timeout', '$http', function($scope, $timeout, $http) {
    $scope.test = "Hello";
    $scope.img0 = {
      src: '/somesrc',
      name: 'Some Name'
    };
    $scope.img1 = {
      src: '/othersrc',
      name: 'Other Name'
    };

    $http.get('/images')
      .success(function(data, status, headers, config) {
          $scope.images = data;
          var at = 0;
          var changeImages = function() {
            if(at >= data.length) {
              at = 0;
            };

            $scope.img1 = {
              src: data[at++].src,
              name: 'Now it is this'
            };
            $timeout(changeImages, 2000);
          };
          $timeout(changeImages, 2000);
          console.log("Had success with " + data);
      }).
      error(function(data, status, headers, config) {
        throw "Had error with status: " + status;
      });

    // $timeout(function() {
    //   $scope.img1 = {
    //     src: '/BLAH',
    //     name: 'Now it is this'
    //   }
    // }, 5000);

  }
]);

app.directive('testDirective', [function() {
    var linkFunction = function() {

    }

    return {
      restrict: 'AE'
      , replace: 'true'
      , template: '<div style="border: 1px solid black"><h1>Test Directive</h1><p>{{imageData.src}}</p><p>{{imageData.name}}</p></div>'
      , link: linkFunction
      , scope: {
        imageData: "=id"
      }
    };
  }
]);
