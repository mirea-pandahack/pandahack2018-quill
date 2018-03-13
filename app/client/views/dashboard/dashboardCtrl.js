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

            //var userstatusRu = 'Тут будет Ваш статус';

            $scope.dashState = function (status) {
                var user = $scope.user;
                console.log(user.status.name);
                console.log(user.status);

                switch (status) {
                    case 'unverified':
                        user.statusRu = 'Не подтверждён EMAIL';
                        return !user.verified;
                    case 'openAndIncomplete':
                        user.statusRu = 'Не заполнена заявка';
                        return regIsOpen && user.verified && !user.status.completedProfile;
                    case 'openAndSubmitted':
                        user.statusRu = 'Заявка отправлена';
                        return regIsOpen && user.status.completedProfile && !user.status.admitted;
                    case 'closedAndIncomplete':
                        user.statusRu = 'closedAndIncomplete';
                        return !regIsOpen && !user.status.completedProfile && !user.status.admitted;
                    case 'closedAndSubmitted': // Waitlisted State
                        user.statusRu = 'closedAndSubmitted';
                        return !regIsOpen && user.status.completedProfile && !user.status.admitted;
                    case 'admittedAndCanConfirm':
                        user.statusRu = 'admittedAndCanConfirm';
                        return !pastConfirmation &&
                            user.status.admitted &&
                            !user.status.confirmed &&
                            !user.status.declined;
                    case 'admittedAndCannotConfirm':
                        user.statusRu = 'admittedAndCannotConfirm';
                        return pastConfirmation &&
                            user.status.admitted &&
                            !user.status.confirmed &&
                            !user.status.declined;
                    case 'confirmed':
                        user.statusRu = 'Заявка подтверждена';
                        return user.status.admitted && user.status.confirmed && !user.status.declined;
                    case 'declined':
                        user.statusRu = 'Заявка отклонена';
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
                    title: "Whoa!",
                    text: "Are you sure you would like to decline your admission? \n\n You can't go back!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, I can't make it.",
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
