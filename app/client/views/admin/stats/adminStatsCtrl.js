angular.module('reg')
  .controller('AdminStatsCtrl',[
    '$scope',
    'UserService',
    function($scope, UserService){

      $('.ui.accordion')
        .accordion()
      ;

      UserService
        .getStats()
        .success(function(stats){
          $scope.stats = stats;
          $scope.loading = false;
        });

      $scope.fromNow = function(date){
        return moment(date).fromNow();
      };

    }]);