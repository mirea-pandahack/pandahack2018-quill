angular.module('reg')
  .factory('Utils', [
    function(){
      return {
        isRegOpen: function(settings){
          return Date.now() > settings.timeOpen && Date.now() < settings.timeClose;
        },
        isAfter: function(time){
          return Date.now() > time;
        },
        formatTime: function(time){

          if (!time){
            return "Invalid Date";
          }

          date = new Date(time);
          // Hack for timezone
          moment.locale('ru');
          return moment(date).format('D MMMM YYYY, H:mm'); // +
            //" " + date.toTimeString().split(' ')[2];

        }
      };
    }]);