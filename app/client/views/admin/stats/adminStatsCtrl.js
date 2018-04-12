angular.module('reg')
  .controller('AdminStatsCtrl', [
    '$scope',
    'UserService',
    function ($scope, UserService) {

      $scope.saveThisTable = function($event) {
        console.log($event.target);
        return false;
        var el = angular.element(e.srcElement);
        var fileText = "";
        var fileTitle = el.previousElementSibling.textContent;
        var tableBody = el.nextElementSibling.querySelectorAll('tbody')[0];
        var tableRows = tableBody.querySelectorAll('tr');
        var columnsAmount = tableRows[0].children.length;
        var rowsAmount = tableRows.length;

        for (var i = 0; i < rowsAmount; i++) {
          for (var j = 0; j < columnsAmount; j++) {

            fileText += tableRows[i].children[j].textContent + ' ';
          }

          fileText += '\n';
        }

        downloadTextFile(fileText, fileTitle);
      }

      function downloadTextFile(fileText, fileTitle) {
        var text = fileText,
          blob = new Blob([text], {type: 'text/plain'}),
          anchor = document.createElement('a');

        anchor.download = fileTitle + ".txt";
        anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
        anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
        anchor.click();
      }

      $('.ui.accordion')
        .accordion();

      UserService
        .getStats()
        .success(function (stats) {
          $scope.stats = stats;
          $scope.loading = false;
        });

      $scope.fromNow = function (date) {
        return moment(date).fromNow();
      };

    }]);