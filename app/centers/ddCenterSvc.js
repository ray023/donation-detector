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
                var u = Settings.getCentersUrl() +
                    '?latitude=' +
                    latitude + '&longitude=' +
                    longitude;
                $http.get( u ).
                success(function(data,status,headers,config){
                    localStorage.setItem('centersByGps', JSON.stringify(data));
                    $ionicLoading.hide();
                    deferred.resolve(data);
                }).
                error(function(data,status,headers,config){
                    $ionicLoading.hide();
                    var errorObject = {
                        data: data,
                        status: status,
                        headers: headers,
                        config: config
                    };
                    deferred.reject(errorObject);
                });
                return deferred.promise;
            }
        }
    });