(function() {
  var app = angular.module('MainApp');

  app.controller('ProposalDialogController', ['$scope', function($scope) {
    console.log("Creating proposal dialog controller");
  }]);

  app.directive('proposalDialog', [function() {
    console.log("Creating proposal dialog");
    var linkFunction = function(scope, element, attrs) {

    }

    return {
      restrict: 'AE'
      , replace: 'true'
      , templateUrl: './resources/partials/pdialog.html'
      , link: linkFunction
      // , scope : true
    };
  }]);

})();
