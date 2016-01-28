/* ===========================================================================
 * Donation Detector
 * ===========================================================================
 * Copyright 2016 Ray Nowell
 * =========================================================================== */
'use strict';

ddApp

    .factory('Drives', function($http, $q, Settings, $ionicLoading) {
        return {
            getByLocation: function(latitude, longitude) {
                var deferred  = $q.defer();
                $ionicLoading.show({template: 'Loading...'});
                $http.get( Settings.getDrivesUrl() +
                    '?latitude=' +
                    latitude + '&longitude=' +
                    longitude).
                success(function(data,status,headers,config){
                    localStorage.setItem('drivesByGps', JSON.stringify(data));
                    $ionicLoading.hide();
                    deferred.resolve(data);
                }).
                error(function(data,status,headers,config){
                    $ionicLoading.hide();
                    deferred.reject(status);
                });
                return deferred.promise;
            }
        }
    });