var _ = require('underscore');
var async = require('async');
var User = require('../models/User');

// In memory stats.
var stats = {};

function calculateStats() {
  console.log('Calculating stats...');
  var newStats = {
    lastUpdated: 0,

    total: 0,
    demo: {
      gender: {
        M: 0,
        F: 0,
        O: 0,
        N: 0
      },
      schools: {},
      year: {
        '2018': 0,
        '2019': 0,
        '2020': 0,
        '2021': 0,
        '2022': 0,
        '2023': 0,
        '2024': 0,
        '2025': 0,
      }
    },

    teams: {},
    verified: 0,
    submitted: 0,
    admitted: 0,
    confirmed: 0,
    confirmedMit: 0,
    declined: 0,

    confirmedFemale: 0,
    confirmedMale: 0,
    confirmedOther: 0,
    confirmedNone: 0,

    shirtSizes: {
      'XS': 0,
      'S': 0,
      'M': 0,
      'L': 0,
      'XL': 0,
      'XXL': 0,
      'WXS': 0,
      'WS': 0,
      'WM': 0,
      'WL': 0,
      'WXL': 0,
      'WXXL': 0,
      'None': 0
    },

    dietaryRestrictions: {},

    hostNeededFri: 0,
    hostNeededSat: 0,
    hostNeededUnique: 0,

    hostNeededFemale: 0,
    hostNeededMale: 0,
    hostNeededOther: 0,
    hostNeededNone: 0,

    reimbursementTotal: 0,
    reimbursementMissing: 0,

    wantsHardware: 0,

    checkedIn: 0,

    statChoosenTask: {
      "Virtual Reality": 0,
      "Leap Motion": 0,
      "Samsung IoT": 0,
      "Aquarius": 0,
      "Foresight": 0,
      "Sibintek": 0,
      "Galaktika": 0,
      "Codabra": 0,
      "No": 0,
    },
    statChoosenTaskSum: 0,
    statNeedToCall: 0,
    needToCallUsers: [],
    usersNotes: [],
    schoolsStats: {},
    needParking: [],
    totalTeams: 0,
    peopleWillBe: []

  };

  User
    .find({})
    .exec(function (err, users) {
      if (err || !users) {
        throw err;
      }

      newStats.total = users.length;

      async.each(users, function (user, callback) {

        // Count people for each task

        var tasksTranslit = [
          {
            ru: "Сибинтек",
            en: "Sibintek"
          },
          {
            ru: "Галактика",
            en: "Galaktika",
          },
          {
            ru: "Кодабра",
            en: "Codabra",
          },
          {
            ru: "Я ещё не выбрал[мы не сможем предоставить Вам комплект оборудования]",
            en: "No",
          }
        ];

        if (user.confirmation.choosenTask) {
          if (user.confirmation.choosenTask in newStats.statChoosenTask) {
            newStats.statChoosenTask[user.confirmation.choosenTask] += 1;
          } else {
            for (let k = 0; k < tasksTranslit.length; k++) {
              if (tasksTranslit[k].ru === user.confirmation.choosenTask) {
                newStats.statChoosenTask[tasksTranslit[k].en] += 1;
                break;
              }
            }
          }
        }

        // for(let taskSum in newStats.statChoosenTask) {
        //   newStats.statChoosenTaskSum += newStats.statChoosenTask[taskSum];
        // }

        // Count people to call
        if (user.confirmation.needToCall) {
          newStats.statNeedToCall++;

          newStats.needToCallUsers.push({
            name: user.profile.name,
            phone: user.confirmation.phone,
            ntime: user.confirmation.needToCall_time
          });
        }

        //Count people with cars
        if (user.confirmation.autoNum && user.confirmation.autoModel) {
          if (user.confirmation.autoNum.length > 6 && user.confirmation.autoModel.length > 1) {
            newStats.needParking.push({
              name: user.profile.name,
              autoNum: user.confirmation.autoNum,
              autoModel: user.confirmation.autoModel
            });
          }
        }

        //User notes
        if (user.profile.essay) {
          newStats.usersNotes.push({
            name: user.profile.name,
            note: user.profile.essay
          });
        }

        //Count universities
        //special check for MIREA
        function isMirea(schoolName) {
          schoolName = schoolName.toLowerCase();
          if (schoolName.includes("мирэа")) {
            return true;
          }
          if (schoolName.includes("mirea")) {
            return true;
          }
          if (schoolName.includes("мту")) {
            return true;
          }
          return false;
        }

        if (user.profile.school && user.profile.school.length > 0) {
          let school = user.profile.school;

          //check if it is MIREA
          if (isMirea(school)) {
            school = 'МИРЭА';
          }

          if (!newStats.schoolsStats[school]) {
            newStats.schoolsStats[school] = {
              count: 0,
              name: school
            };
          }

          newStats.schoolsStats[school].count++;
        }


        //people for enterance
        if (user.profile.name) {
          newStats.peopleWillBe.push(user.profile.name);
        }


//--------------------------------------------------------------------------------------------


        // Grab the email extension
        var email = user.email.split('@')[1];

        // Add to the gender
        newStats.demo.gender[user.profile.gender] += 1;

        // Count verified
        newStats.verified += user.verified ? 1 : 0;

        // Count submitted
        newStats.submitted += user.status.completedProfile ? 1 : 0;

        // Count accepted
        newStats.admitted += user.status.admitted ? 1 : 0;

        // Count confirmed
        newStats.confirmed += user.status.confirmed ? 1 : 0;

        // Count confirmed that are mit
        newStats.confirmedMit += user.status.confirmed && email === "mit.edu" ? 1 : 0;

        newStats.confirmedFemale += user.status.confirmed && user.profile.gender == "F" ? 1 : 0;
        newStats.confirmedMale += user.status.confirmed && user.profile.gender == "M" ? 1 : 0;
        newStats.confirmedOther += user.status.confirmed && user.profile.gender == "O" ? 1 : 0;
        newStats.confirmedNone += user.status.confirmed && user.profile.gender == "N" ? 1 : 0;

        // Count declined
        newStats.declined += user.status.declined ? 1 : 0;

        // Count the number of people who need reimbursements
        newStats.reimbursementTotal += user.confirmation.needsReimbursement ? 1 : 0;

        // Count the number of people who still need to be reimbursed
        newStats.reimbursementMissing += user.confirmation.needsReimbursement &&
        !user.status.reimbursementGiven ? 1 : 0;

        // Count the number of people who want hardware
        newStats.wantsHardware += user.confirmation.wantsHardware ? 1 : 0;

        // Count schools
        if (!newStats.demo.schools[email]) {
          newStats.demo.schools[email] = {
            submitted: 0,
            admitted: 0,
            confirmed: 0,
            declined: 0,
          };
        }
        newStats.demo.schools[email].submitted += user.status.completedProfile ? 1 : 0;
        newStats.demo.schools[email].admitted += user.status.admitted ? 1 : 0;
        newStats.demo.schools[email].confirmed += user.status.confirmed ? 1 : 0;
        newStats.demo.schools[email].declined += user.status.declined ? 1 : 0;

        // Count graduation years
        if (user.profile.graduationYear) {
          newStats.demo.year[user.profile.graduationYear] += 1;
        }

        // Grab the team name if there is one
        if (user.teamCode && user.teamCode.length > 0) {
          if (!newStats.teams[user.teamCode]) {
            newStats.teams[user.teamCode] = {
              users: []
            };
          }
          newStats.teams[user.teamCode].users.push(user.profile.name += '(' + user.confirmation.phone + ')');

          //parse team challenge
          if (newStats.teams[user.teamCode].challenge === undefined) {
            if (user.confirmation.choosenTask) {
              newStats.teams[user.teamCode].challenge = user.confirmation.choosenTask;
            }
          } else {
            if (user.confirmation.choosenTask && newStats.teams[user.teamCode].challenge !== user.confirmation.choosenTask) {
              newStats.teams[user.teamCode].challenge += ' [ИЛИ] ' + user.confirmation.choosenTask;
            }
          }
        }

        // Count total teams
        newStats.totalTeams = Object.keys(newStats.teams).length;


        // Count shirt sizes
        if (user.confirmation.shirtSize in newStats.shirtSizes) {
          newStats.shirtSizes[user.confirmation.shirtSize] += 1;
        }

        // Host needed counts
        newStats.hostNeededFri += user.confirmation.hostNeededFri ? 1 : 0;
        newStats.hostNeededSat += user.confirmation.hostNeededSat ? 1 : 0;
        newStats.hostNeededUnique += user.confirmation.hostNeededFri || user.confirmation.hostNeededSat ? 1 : 0;

        newStats.hostNeededFemale
          += (user.confirmation.hostNeededFri || user.confirmation.hostNeededSat) && user.profile.gender == "F" ? 1 : 0;
        newStats.hostNeededMale
          += (user.confirmation.hostNeededFri || user.confirmation.hostNeededSat) && user.profile.gender == "M" ? 1 : 0;
        newStats.hostNeededOther
          += (user.confirmation.hostNeededFri || user.confirmation.hostNeededSat) && user.profile.gender == "O" ? 1 : 0;
        newStats.hostNeededNone
          += (user.confirmation.hostNeededFri || user.confirmation.hostNeededSat) && user.profile.gender == "N" ? 1 : 0;

        // Dietary restrictions
        if (user.confirmation.dietaryRestrictions) {
          user.confirmation.dietaryRestrictions.forEach(function (restriction) {
            if (!newStats.dietaryRestrictions[restriction]) {
              newStats.dietaryRestrictions[restriction] = 0;
            }
            newStats.dietaryRestrictions[restriction] += 1;
          });
        }

        // Count checked in
        newStats.checkedIn += user.status.checkedIn ? 1 : 0;

        callback(); // let async know we've finished
      }, function () {
        // Transform dietary restrictions into a series of objects
        var restrictions = [];
        _.keys(newStats.dietaryRestrictions)
          .forEach(function (key) {
            restrictions.push({
              name: key,
              count: newStats.dietaryRestrictions[key],
            });
          });
        newStats.dietaryRestrictions = restrictions;

        // Transform schools into an array of objects
        var schools = [];
        _.keys(newStats.demo.schools)
          .forEach(function (key) {
            schools.push({
              email: key,
              count: newStats.demo.schools[key].submitted,
              stats: newStats.demo.schools[key]
            });
          });
        newStats.demo.schools = schools;

        // Likewise, transform the teams into an array of objects
        var teams = [];
        _.keys(newStats.teams)
          .forEach(function (key) {
            teams.push({
              name: key,
              challenge: newStats.teams[key].challenge,
              users: newStats.teams[key].users
            });
          });
        newStats.teams = teams;

        console.log('Stats updated!');
        newStats.lastUpdated = new Date();
        stats = newStats;
      });
    });

}

// Calculate once every five minutes.
calculateStats();
setInterval(calculateStats, 300000);

var Stats = {};

Stats.getUserStats = function () {
  return stats;
};

module.exports = Stats;
