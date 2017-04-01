/* ===========================================================================
 * Donation Detector
 * ===========================================================================
 * Copyright 2016 Ray Nowell
 * =========================================================================== */
'use strict';

ddApp

    .factory('Centers', function($http, $q, Settings, $ionicLoading) {
        return {
            getByLocation: function(latitude, longitude) {
                var deferred  = $q.defer(),
                                TODAY_ONLY = 0;
                var myParams = {
                    dateof: moment().startOf("day").add(TODAY_ONLY, "days").unix(),
                    tzoffset: moment().format("ZZ")
                };
                $ionicLoading.show({template: 'Loading...'});

                $http({
                    url: Settings.getCentersUrl(),
                    method: 'POST',
                    data:  myParams
                }).
                success(function(data,status,headers,config){
                    var centers = [];

                    for (var i = 0; i < data.length; i++) {
                        var driveDistance = Settings.getDistance(latitude, longitude, data[i].latitude, data[i].longitude);

                        if (driveDistance > Settings.getMileageThreshold())
                            continue;

                        if (data[i].name.indexOf('Center') == -1)
                            continue;

                        var center = {
                            CenterId: data[i].id,
                            Location: data[i].name,
                            NavLink: 'http://maps.google.com/?saddr=' + latitude + ',' + longitude + '&daddr=' + data[i].latitude + ',' + data[i].longitude,
                            Address: data[i].street1,
                            City: data[i].city,
                            State: data[i].state,
                            Zip: data[i].zipcode,
                            Miles: driveDistance,
                            StartTime: new Date(data[i].from_time * 1000),
                            EndTime: new Date(data[i].thru_time * 1000)
                        };
                        centers.push(center);
                    }
                    $ionicLoading.hide();
                    deferred.resolve(centers);
                }).
                error(function(data,status,headers,config){
                    $ionicLoading.hide();
                    deferred.reject(status);
                });
                return deferred.promise;
            }
        }
    });