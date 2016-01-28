/* ===========================================================================
 * Donation Detector
 * ===========================================================================
 * Copyright 2016 Ray Nowell
 * =========================================================================== */
'use strict';

ddApp
    .factory('Location', function($q, $ionicLoading) {
        return {
            getCurrentPosition: function() {
                var deferred  = $q.defer();
                $ionicLoading.show({template: 'Getting Location...'});
                navigator.geolocation
                    .getCurrentPosition(
                        function (data) {
                            $ionicLoading.hide();
                            deferred.resolve(data);
                        },
                        function (error) {
                            $ionicLoading.hide();
                            var errorMessage = 'Error getting current position.';
                            switch(error.code) {
                                case error.PERMISSION_DENIED:
                                    errorMessage = "User denied the request for Geolocation."
                                    break;
                                case error.POSITION_UNAVAILABLE:
                                    errorMessage = "Location information is unavailable."
                                    break;
                                case error.TIMEOUT:
                                    errorMessage = "The request to get user location timed out.<br>Please turn on (or restart) Location services on your device."
                                    break;
                                case error.UNKNOWN_ERROR:
                                    errorMessage = "An unknown error occurred."
                                    break;
                            }

                            var data = {errorCode: error.code,
                                errorMessage: errorMessage};
                            deferred.reject(data);
                        },
                        {timeout:5000, enableHighAccuracy:false});

                return deferred.promise;
            }
        }
    }
)