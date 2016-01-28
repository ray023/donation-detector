/* ===========================================================================
 * Donation Detector
 * ===========================================================================
 * Copyright 2016 Ray Nowell
 * =========================================================================== */
'use strict';
ddApp
    .controller('ScheduleCtrl',
        function($scope, $ionicPopup) {

            function creationReminder() {
                if ($scope.data.ReminderDate == '')
                {
                    $ionicPopup.alert({
                        title: 'Field Required',
                        okType: 'button-energized',
                        template: 'Please enter your donation date.'
                    });

                    return;
                }

                if ($scope.data.ReminderText.trim() == '')
                {
                    $ionicPopup.alert({
                        title: 'Field Required',
                        okType: 'button-energized',
                        template: 'Please enter your donation text.'
                    });

                    return;
                }

                var cal = window.plugins.calendar;
                var loc = '';
                var title = $scope.data.ReminderText;
                var notes = "Open Donation Detector to find the closest blood drive.";
                var start = $scope.data.ReminderDate;
                var end = $scope.data.ReminderDate;

                var onSuccess = function(message) {
                    console.log("Success: " + JSON.stringify(message));

                    // open at a specific date, here today + 3 days
                    var d = $scope.data.ReminderDate;
                    window.plugins.calendar.openCalendar(d); // callbacks are optional
                };
                var onError = function(message) {console.error("Error: " + message)};

                cal.createEvent(title, loc, notes, start, end, onSuccess, onError);
            }

            function calculateDate(daysToWait)
            {
                var currentDate = new Date();
                currentDate.setHours(currentDate.getHours() + (daysToWait * 24) );
                $scope.data.ReminderDate = currentDate;
            }
            $scope.data = {
                ReminderDate: '',
                ReminderText: 'You can donate blood now!'
            };
            $scope.calculateDate = calculateDate;

            $scope.nextDonationDate = creationReminder;

        });
