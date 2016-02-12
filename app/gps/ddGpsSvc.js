/* ===========================================================================
 * Donation Detector
 * ===========================================================================
 * Copyright 2016 Ray Nowell
 * =========================================================================== */
'use strict';

ddApp

    .factory('Drives', function ($http, $q, Settings, $ionicLoading) {

        function findDaysTill(todaysDateAndTime, driveDateAndTime) {
            var DAY_FACTOR = 1000 * 60 * 60 * 24,
                ALWAYS_12_TO_ACCOUNT_FOR_TIMEZONE = 12,
                d1 = new Date(todaysDateAndTime.FullYear,
                    todaysDateAndTime.Month - 1,
                    todaysDateAndTime.Day,
                    ALWAYS_12_TO_ACCOUNT_FOR_TIMEZONE);
            var d2 = new Date(driveDateAndTime.FullYear,
                    driveDateAndTime.Month - 1,
                    driveDateAndTime.Day,
                    ALWAYS_12_TO_ACCOUNT_FOR_TIMEZONE);
            return (d2 - d1) / DAY_FACTOR;
        }
        function formatDriveTime(driveTime)
        {
            var split = driveTime.split(':'),
                hour = split[0] < 12 ? split[0] : split[0] - 12,
                meridiem = split[0] < 12 ? 'am' : 'pm';
            return hour + ':' + split[1] + ' ' + meridiem;
        }

        return {
            getByLocation: function (latitude, longitude) {
                var deferred = $q.defer();
                $ionicLoading.show({template: 'Loading...'});
                $http.get(Settings.getDrivesUrl()).success(function (data, status, headers, config) {

                    var drives = [],
                        tempToday = new Date(),
                        todaysDateAndTime = {
                            Month: tempToday.getMonth() + 1,
                            Day: tempToday.getDate(),
                            FullYear: tempToday.getFullYear()
                        };

                    for (var i = 0; i < data.DRIVEID.length; i++) {
                        var startTimeSplit = data.STARTTIME[i].split(':'),
                            endTimeSplit = data.ENDTIME[i].split(':'),
                            splitDate = data.DRIVEDATE[i].split('-'),
                            driveDateAndTime = {
                                Month: splitDate[1],
                                Day: splitDate[2],
                                FullYear: splitDate[0]
                            },
                            daysTill = findDaysTill(todaysDateAndTime, driveDateAndTime),
                            driveDistance = Settings.getDistance(latitude, longitude, data.LATITUDE[i], data.LONGITUDE[i]);

                        if (daysTill < 0 || driveDistance > Settings.getMileageThreshold())
                            continue;

                        var drive = {
                            DriveId: data.DRIVEID[i],
                            DriveDate: data.DRIVEDATE[i],
                            StartTime: formatDriveTime(data.STARTTIME[i]),
                            EndTime: formatDriveTime(data.ENDTIME[i]),
                            Location: data.LOCATION[i],
                            NavLink: 'http://maps.google.com/?saddr=' + latitude + ',' + longitude + '&daddr=' + data.LATITUDE[i] + ',' + data.LONGITUDE[i],
                            Address: data.ADDRESS[i],
                            City: data.CITY[i],
                            State: data.STATE[i],
                            Zip: data.ZIP[i],
                            Miles: driveDistance,
                            DaysTill: daysTill,
                            StartHour: startTimeSplit[0],
                            StartMinute: startTimeSplit[1],
                            EndHour: endTimeSplit[0],
                            EndMinute: endTimeSplit[1]
                        };
                        drives.push(drive);
                    }
                    $ionicLoading.hide();
                    deferred.resolve(drives);
                }).error(function (data, status, headers, config) {
                    $ionicLoading.hide();
                    deferred.reject(status);
                });
                return deferred.promise;
            }
        }
    });