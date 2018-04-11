angular.module('reg')
    .controller('DashboardCtrl', [
        '$rootScope',
        '$scope',
        '$sce',
        'currentUser',
        'settings',
        'Utils',
        'AuthService',
        'UserService',
        'EVENT_INFO',
        'DASHBOARD',
        function ($rootScope, $scope, $sce, currentUser, settings, Utils, AuthService, UserService, EVENT_INFO, DASHBOARD) {
            var Settings = settings.data;
            var user = currentUser.data;
            $scope.user = user;
            $scope.timeClose = Utils.formatTime(Settings.timeClose);
            $scope.timeConfirm = Utils.formatTime(Settings.timeConfirm);

            $scope.DASHBOARD = DASHBOARD;

            for (var msg in $scope.DASHBOARD) {
                if ($scope.DASHBOARD[msg].includes('[APP_DEADLINE]')) {
                    $scope.DASHBOARD[msg] = $scope.DASHBOARD[msg].replace('[APP_DEADLINE]', Utils.formatTime(Settings.timeClose));
                }
                if ($scope.DASHBOARD[msg].includes('[CONFIRM_DEADLINE]')) {
                    $scope.DASHBOARD[msg] = $scope.DASHBOARD[msg].replace('[CONFIRM_DEADLINE]', Utils.formatTime(user.status.confirmBy));
                }
            }

            // Is registration open?
            var regIsOpen = $scope.regIsOpen = Utils.isRegOpen(Settings);

            // Is it past the user's confirmation time?
            var pastConfirmation = $scope.pastConfirmation = Utils.isAfter(user.status.confirmBy);

            $scope.dashState = function (status) {
                var user = $scope.user;

                switch (user.status.name){
                    case 'unverified':
                        user.statusRu = 'Не подтверждён EMAIL';
                        break;
                    case 'incomplete':
                        user.statusRu = 'Не заполнена заявка';
                        break;
                    case 'submitted':
                        user.statusRu = 'Заявка отправлена';
                        break;
                  case 'admitted':
                        user.statusRu = 'Мы ждём тебя!'; //Заявка одобрена
                        break;
                    case 'confirmed':
                        user.statusRu = 'Ура! Скоро увидимся'; //'confirmed';
                        break;
                    case 'declined':
                        user.statusRu = 'Заявка отклонена';
                        break;
                    case 'checked in':
                        user.statusRu = 'Вы подтвердили участие';
                        break;
                    default:
                        user.statusRu = 'Тут будет Ваш статус';
                        break;
                }


                switch (status) {
                    case 'unverified':
                        return !user.verified;
                    case 'openAndIncomplete':
                        return regIsOpen && user.verified && !user.status.completedProfile;
                    case 'openAndSubmitted':
                        return regIsOpen && user.status.completedProfile && !user.status.admitted;
                    case 'closedAndIncomplete':
                        return !regIsOpen && !user.status.completedProfile && !user.status.admitted;
                    case 'closedAndSubmitted': // Waitlisted State
                        return !regIsOpen && user.status.completedProfile && !user.status.admitted;
                    case 'admittedAndCanConfirm':
                        return !pastConfirmation &&
                            user.status.admitted &&
                            !user.status.confirmed &&
                            !user.status.declined;
                    case 'admittedAndCannotConfirm':
                        return pastConfirmation &&
                            user.status.admitted &&
                            !user.status.confirmed &&
                            !user.status.declined;
                    case 'confirmed':
                        return user.status.admitted && user.status.confirmed && !user.status.declined;
                    case 'declined':
                        /*
                        @TODO: check WTF, register -> your status declined 0o
                        but console.log(user.status.name); return incomplete
                        */
                        return user.status.declined;
                }
                return false;
            };

            $scope.showWaitlist = !regIsOpen && user.status.completedProfile && !user.status.admitted;

            $scope.resendEmail = function () {
                AuthService
                    .resendVerificationEmail()
                    .then(function () {
                        sweetAlert('Письмо было отправлено.');
                    });
            };


            // -----------------------------------------------------
            // Text!
            // -----------------------------------------------------
            var converter = new showdown.Converter();
            $scope.acceptanceText = $sce.trustAsHtml(converter.makeHtml(Settings.acceptanceText));
            $scope.confirmationText = $sce.trustAsHtml(converter.makeHtml(Settings.confirmationText));
            $scope.waitlistText = $sce.trustAsHtml(converter.makeHtml(Settings.waitlistText));

            $scope.declineAdmission = function () {

                swal({
                    title: "Воу!",
                    text: "Ты уверен, что не сможешь прийти на PandaHack 2018? \n\n Это действие нельзя отменить :с",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: "Я ещё подумаю",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Увы, я уверен",
                    closeOnConfirm: true
                }, function () {

                    UserService
                        .declineAdmission(user._id)
                        .success(function (user) {
                            $rootScope.currentUser = user;
                            $scope.user = user;
                        });
                });
            };

        }]);
