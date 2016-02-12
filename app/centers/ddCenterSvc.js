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
                var deferred  = $q.defer();
                $ionicLoading.show({template: 'Loading...'});
                $http.get( Settings.getCentersUrl() +
                    '?latitude=' +
                    latitude + '&longitude=' +
                    longitude).
                success(function(data,status,headers,config){
                    var centers = [];
                    for (var i = 0; i < data.CENTERID.length; i++) {
                        var driveDistance = Settings.getDistance(latitude, longitude, data.LATITUDE[i], data.LONGITUDE[i]);

                        if (driveDistance > Settings.getMileageThreshold())
                            continue;

                        var center = {
                            CenterId: data.CENTERID[i],
                            Location: data.LOCATION[i],
                            NavLink: 'http://maps.google.com/?saddr=' + latitude + ',' + longitude + '&daddr=' + data.LATITUDE[i] + ',' + data.LONGITUDE[i],
                            Address: data.ADDRESS[i],
                            City: data.CITY[i],
                            State: data.STATE[i],
                            Zip: data.ZIP[i],
                            Miles: driveDistance
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