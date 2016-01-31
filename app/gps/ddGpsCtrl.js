/* ===========================================================================
 * Donation Detector
 * ===========================================================================
 * Copyright 2016 Ray Nowell
 * =========================================================================== */
'use strict';

ddApp
    .controller('GpsCtrl',
        function($scope, $ionicPopup, Drives, Location, Settings, $timeout) {
            $scope.DrivesModel = Drives;

            function getDirections(navLink)
            {
                if (Settings.userNavApp() != 'Google')
                    navLink = navLink.replace('google',Settings.userNavApp());

                window.open(navLink, '_system', 'location=yes');
            }

            function getDriveStatus(driveObject)
            {
                var returnStatus,
                    driveStartHour = driveObject.StartHour,
                    driveStartMinute = driveObject.StartMinute,
                    driveEndHour = driveObject.EndHour,
                    driveEndMinute = driveObject.EndMinute,
                    deviceHour = new Date().getHours(),
                    deviceMinute = new Date().getMinutes();
                if(driveStartHour > deviceHour || (driveStartHour == deviceHour && driveStartMinute > deviceMinute))
                {
                    returnStatus = {
                        Status: 'Has not started',
                        StatusClass: 'energized'
                    };
                }
                else if (driveEndHour < deviceHour || (driveEndHour == deviceHour && driveEndMinute < deviceMinute))
                {
                    returnStatus = {
                        Status: 'Expired',
                        StatusClass: 'assertive'
                    };
                }
                else
                {
                    returnStatus = {
                        Status: 'Active',
                        StatusClass: 'balanced'
                    };
                }

                return returnStatus;
            }

            function getDrivesForScope(drives)
            {
                var todaysDrives = [],
                    tomorrowsDrives = [],
                    afterTomorrowDrives = [];
                for(var i = 0; i < drives.length; i++) {
                    switch (drives[i].DaysTill)
                    {
                        case 0:
                            var driveStatus = getDriveStatus(drives[i]);
                            drives[i].Status = driveStatus.Status;
                            drives[i].StatusClass = driveStatus.StatusClass;
                            todaysDrives.push(drives[i]);
                            break;
                        case 1:
                            tomorrowsDrives.push(drives[i]);
                            break;
                        default:
                            afterTomorrowDrives.push(drives[i]);
                            break;
                    }
                }
                var drivesForScope = [];
                if (todaysDrives.length > 0)
                {
                    drivesForScope.push({
                        title: 'Today',
                        driveData: todaysDrives
                    });
                }
                if (tomorrowsDrives.length > 0)
                {
                    drivesForScope.push({
                        title: 'Tomorrow',
                        driveData: tomorrowsDrives
                    });
                }
                if (afterTomorrowDrives.length > 0)
                {
                    drivesForScope.push({  title: 'After Tomorrow',
                        driveData: afterTomorrowDrives
                    });
                }

                return drivesForScope;
            }

            var success_callback = function(position){

                Drives.getByLocation(position.coords.latitude, position.coords.longitude)
                    .then(function (drives) {
                            var noDrivesMsg = '';
                            if (drives.length == 0)
                                noDrivesMsg = 'No Blood Mobiles could be found near your location.';

                            $scope.data = {
                                drives: getDrivesForScope(drives),
                                noDrivesMsg: noDrivesMsg
                            };
                            $scope.getDirections = getDirections;
                        },
                        function (errorObject) {
                            var statusMessage;
                            if (errorObject.statusCode == '404')
                                statusMessage = 'Could not connect to server.  Please make sure you have network connectivity.';
                            else
                            {
                                statusMessage = 'status: ' + errorObject.status + '\r\n' +
                                    'headers: ' + errorObject.headers + '\r\n' +
                                    'data: ' + errorObject.data + '\r\n' +
                                    'config: ' + errorObject.config;
                            }

                            $ionicPopup.alert({
                                title: 'Server Error: ' + errorObject.statusCode,
                                okType: 'button-assertive',
                                template: statusMessage
                            });
                        });
            };

            var error_callback = function(error){
                $ionicPopup.alert({
                    title: 'GPS Error',
                    okType: 'button-assertive',
                    template: error.errorCode + ': ' + error.errorMessage
                })
            };

            $timeout(function(){console.log('Wait 2 seconds to give Ionic time to load geolocation plugin ');}, 2000).then(function(){
                    Location.getCurrentPosition().then(
                        success_callback,
                        error_callback
                    );
                }
            );

            $scope.refreshDriveList = function() {
                Location.getCurrentPosition().then(
                    success_callback,
                    error_callback
                );
                $scope.$broadcast('scroll.refreshComplete');
            };

        });
