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

    var registered = {};
    var idAt = 0;
    $scope.api = {
      getNewImage: function(id) {
        if (typeof $scope.images != 'undefined') {
          if(registered[id] >= $scope.images.length) {
            registered[id] = 0;
          }
          return $scope.images[registered[id]++];
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
          var at = 0;
          // var changeImages = function() {
          //   if(at >= data.length) {
          //     at = 0;
          //   };
          //
          //   $scope.img1 = {
          //     src: data[at++].src,
          //     name: 'Now it is this'
          //   };
          //   $timeout(changeImages, 2000);
          // };
          // $timeout(changeImages, 2000);
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

app.directive('testDirective', ['$timeout', function($timeout) {
    var linkFunction = function(scope, element, attrs) {
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
      console.log("\n\nParent Scope (this):");
      for(item in scope.$parent.this) {
        if(scope.$parent.this.hasOwnProperty(item)) {
          console.log(item + ": " + scope[item]);
        }
      }

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

      // console.log("Scope:");
      // for(item in scope) {
      //   if(scope.hasOwnProperty(item)) {
      //     console.log(item + ": " + scope[item]);
      //   }
      // }
      //
      // console.log("Root Scope:");
      // for(item in scope.rootScope {
      //   if(scope.rootScope.hasOwnProperty(item)) {
      //     console.log(item + ": " + scope[item]);
      //   }
      // }


      // scope.api.registerForImages(scope.imageData);
      // var changeImages = function() {
      //   scope.api.getNewImage(scope.imageData);
      //   $timeout(changeImages, 2000);
      // };
      // $timeout(changeImages, 2000);
    }

    // scope.api.registerForImages(scope.imageData);
    // var changeImages = function() {
    //   scope.api.getNewImage(scope.imageData);
    //   $timeout(changeImages, 2000);
    // };
    // $timeout(changeImages, 2000);

    return {
      restrict: 'AE'
      , replace: 'true'
      , template: '<div style="border: 1px solid black"><h1>Test Directive</h1><p>{{imageData.src}}</p><p>{{imageData.name}}</p></div>'
      , link: linkFunction
      // , scope: {
      //   rootScope: '&'
      // }
      , scope: true
      // , transclude: true
      // , scope: {
      //   imageData: "=id"
      //   //, joe: 'a?pi'
      //   , testId: "@testId"
      //   , api: "=api"
      // }
    };
  }
]);
