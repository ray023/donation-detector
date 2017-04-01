/* ===========================================================================
 * Donation Detector
 * ===========================================================================
 * Copyright 2016 Ray Nowell
 * =========================================================================== */
'use strict';

ddApp

    .factory('Drives', function ($http, $q, Settings, $ionicLoading) {

        return {
            getByLocation: function (latitude, longitude, day_of) {
                var deferred = $q.defer();
                var myParams = {
                    dateof: moment().startOf("day").add(day_of, "days").unix(),
                    tzoffset: moment().format("ZZ")
                };

                $ionicLoading.show({template: 'Loading...'});
                $http({
                        url: Settings.getDrivesUrl(),
                        method: 'POST',
                        data:  myParams
                    }).success(function (data, status, headers, config) {
                    var drives = [];

                    for (var i = 0; i < data.length; i++) {

                        if (data[i].name.indexOf('Center') !== -1)
                            continue;


                        var tempDriveStartDate = new Date(data[i].from_time * 1000),
                            tempDriveEndDate = new Date(data[i].thru_time * 1000),
                            daysTill = day_of,
                            driveDistance = Settings.getDistance(latitude, longitude, data[i].latitude, data[i].longitude);


                        if (driveDistance > Settings.getMileageThreshold())
                            continue;

                        var drive = {
                            DriveId: data[i].id,
                            DriveDate: tempDriveStartDate,
                            StartTime: tempDriveStartDate.getTime(),
                            EndTime: tempDriveEndDate.getTime(),
                            Location: data[i].name,
                            NavLink: 'http://maps.google.com/?saddr=' + latitude + ',' + longitude + '&daddr=' + data[i].latitude + ',' + data[i].longitude,
                            Address: data[i].street1,
                            City: data[i].city,
                            State: data[i].state,
                            Zip: data[i].zipcode,
                            Miles: driveDistance,
                            DaysTill: day_of
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