angular.module('reg')
  .controller('AdminWaitingCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    'UserService',
    function ($scope, $state, $stateParams, UserService) {

      $scope.pages = [];
      $scope.users = [];

      // Semantic-UI moves modal content into a dimmer at the top level.
      // While this is usually nice, it means that with our routing will generate
      // multiple modals if you change state. Kill the top level dimmer node on initial load
      // to prevent this.
      $('.ui.dimmer').remove();
      // Populate the size of the modal for when it appears, with an arbitrary user.
      $scope.selectedUser = {};
      $scope.selectedUser.sections = generateSections({
        status: '',
        confirmation: {
          dietaryRestrictions: []
        },
        profile: ''
      });

      function updatePage(data) {
        //filter to show only not admitted users
        let arr = [];
        for (let i = 0; i < data.users.length; i++) {
          if (!data.users[i].status.admitted && data.users[i].profile.name) {
            arr.push(data.users[i]);
          }
        }

        console.log(data);
        console.log(arr);

        data.users = arr;

        $scope.users = data.users;
        $scope.currentPage = data.page;
        $scope.pageSize = data.size;

        var p = [];
        for (var i = 0; i < data.totalPages; i++) {
          p.push(i);
        }
        $scope.pages = p;
      }

      UserService
        .getPage($stateParams.page, 1000, $stateParams.query)
        .success(function (data) {
          updatePage(data);
        });

      $scope.$watch('queryText', function (queryText) {
        UserService
          .getPage($stateParams.page, 1000, queryText)
          .success(function (data) {
            updatePage(data);
          });
      });

      $scope.goToPage = function (page) {
        $state.go('app.admin.waiting', {
          page: page,
          size: 1000 || 50
        });
      };

      $scope.goUser = function ($event, user) {
        $event.stopPropagation();

        $state.go('app.admin.user', {
          id: user._id
        });
      };

      $scope.toggleCheckIn = function ($event, user, index) {
        $event.stopPropagation();

        if (!user.status.checkedIn) {
          swal({
              title: "Whoa, wait a minute!",
              text: "You are about to check in " + user.profile.name + "!",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, check them in.",
              closeOnConfirm: false
            },
            function () {
              UserService
                .checkIn(user._id)
                .success(function (user) {
                  $scope.users[index] = user;
                  swal("Accepted", user.profile.name + ' has been checked in.', "success");
                });
            }
          );
        } else {
          UserService
            .checkOut(user._id)
            .success(function (user) {
              $scope.users[index] = user;
              swal("Accepted", user.profile.name + ' has been checked out.', "success");
            });
        }
      };

      $scope.acceptUser = function ($event, user, index) {
        $event.stopPropagation();

        swal({
          title: "Whoa, wait a minute!",
          text: "You are about to accept " + user.profile.name + "!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, accept them.",
          closeOnConfirm: false
        }, function () {

          swal({
            title: "Are you sure?",
            text: "Your account will be logged as having accepted this user. " +
            "Remember, this power is a privilege.",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, accept this user.",
            closeOnConfirm: false
          }, function () {

            UserService
              .admitUser(user._id)
              .success(function (user) {
                UserService
                  .sendInvitation(user._id)
                  .success(function () {
                    swal("Accepted", 'Has been admitted.', "success");

                    //change status of this user
                    let iconEl = $event.target.parentNode;

                    //check if it is btn
                    console.log(iconEl);
                    console.log(iconEl.tagName.toLowerCase());
                    if(iconEl.tagName.toLowerCase() == 'i'){
                      iconEl = $event.target.parentNode;
                    }
                    console.log(iconEl);
                    console.log(iconEl.previousElementSibling);
                    console.log(iconEl.previousElementSibling.previousElementSibling);
                    console.log();

                    iconEl = iconEl.previousElementSibling.previousElementSibling.querySelectorAll('.userAdmittedIcon')[0];
                    iconEl.classList.remove('thin');
                    iconEl.classList.add('green check');
                  });
              });


          });

        });

      };

      function formatTime(time) {
        if (time) {
          return moment(time).format('MMMM Do YYYY, h:mm:ss a');
        }
      }

      $scope.rowClass = function (user) {
        if (user.admin) {
          return 'admin';
        }
        if (user.status.confirmed) {
          return 'positive';
        }
        if (user.status.admitted && !user.status.confirmed) {
          return 'warning';
        }
      };

      function selectUser(user) {
        $scope.selectedUser = user;
        $scope.selectedUser.sections = generateSections(user);
        $('.long.user.modal')
          .modal('show');
      }

      function generateSections(user) {
        return [{
          name: 'Basic Info',
          fields: [{
            name: 'Created On',
            value: formatTime(user.timestamp)
          }, {
            name: 'Last Updated',
            value: formatTime(user.lastUpdated)
          }, {
            name: 'Confirm By',
            value: formatTime(user.status.confirmBy) || 'N/A'
          }, {
            name: 'Checked In',
            value: formatTime(user.status.checkInTime) || 'N/A'
          }, {
            name: 'Email',
            value: user.email
          }, {
            name: 'Team',
            value: user.teamCode || 'None'
          }]
        }, {
          name: 'Profile',
          fields: [{
            name: 'Name',
            value: user.profile.name
          }, {
            name: 'Gender',
            value: user.profile.gender
          }, {
            name: 'School',
            value: user.profile.school
          }, {
            name: 'Country',
            value: user.profile.country
          }, {
            name: 'Date of Birth',
            value: user.profile.date
          }, {
            name: 'Graduation Year',
            value: user.profile.graduationYear
          }, {
            name: 'Description',
            value: user.profile.description
          }, {
            name: 'Github',
            value: user.profile.github
          }, {
            name: 'Dribbble',
            value: user.profile.dribbble
          }, {
            name: 'LinkedIn',
            value: user.profile.linkedin
          }, {
            name: 'Personal Site',
            value: user.profile.personalSite
          }, {
            name: 'Devpost',
            value: user.profile.devpost
          }, {
            name: 'Section',
            value: user.profile.section
          }, {
            name: 'Essay',
            value: user.profile.essay
          }, {
            name: 'Else',
            value: user.profile.essayElse
          }]
        }, {
          name: 'Confirmation',
          fields: [{
            name: 'Phone Number',
            value: user.confirmation.phone
          }]
        }];
      }

      $scope.selectUser = selectUser;

    }
  ]);
