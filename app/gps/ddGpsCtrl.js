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
                    deviceCurrentDate = new Date();

                if(deviceCurrentDate.getTime() - driveObject.StartTime  < 0)
                {
                    returnStatus = {
                        Status: 'Has not started' ,
                        StatusClass: 'energized'
                    };
                }
                else if (deviceCurrentDate.getTime() - driveObject.EndTime > 0)
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
            function getByLocation_success(drives)
            {
                var noDrivesMsg = '';
                if (drives.length == 0)
                    noDrivesMsg = 'No Blood Mobiles could be found near your location.';

                $scope.data = {
                    drives: getDrivesForScope(drives),
                    noDrivesMsg: noDrivesMsg
                };

            }
            function getByLocation_fail(statusCode)
            {
                var statusMessage = 'Server Error:  ' + statusCode;
                if (statusCode == '404')
                    statusMessage = 'Could not connect to server.  Please make sure you have network connectivity.';

                $ionicPopup.alert({
                    title: 'Server Error: ' + statusCode,
                    okType: 'button-assertive',
                    template: statusMessage
                });
            }
            var success_callback = function(position){
                var today_index = 0,
                        tomorrow_index = 1,
                        day_after_tomorrow_index = 2;
                $scope.getDirections = getDirections;

                Drives.getByLocation(position.coords.latitude, position.coords.longitude, today_index)
                        .then(function (todaysDrives) {
                            Drives.getByLocation(position.coords.latitude, position.coords.longitude, tomorrow_index)
                                .then(function (tomorrowsDrives) {
                                    Drives.getByLocation(position.coords.latitude, position.coords.longitude, day_after_tomorrow_index )
                                        .then(function (dayAfterTomorrowDrives) {
                                            var drives = todaysDrives
                                                            .concat(tomorrowsDrives)
                                                            .concat(dayAfterTomorrowDrives);
                                            getByLocation_success(drives);
                                        })
                                })
                    },function (statusCode) {getByLocation_fail(statusCode)});
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
