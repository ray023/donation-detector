/* ===========================================================================
 * Donation Detector
 * ===========================================================================
 * Copyright 2016 Ray Nowell
 * =========================================================================== */
'use strict';
ddApp
    .controller('CentersCtrl',
        function($scope, $ionicPopup, Centers, Location, Settings, $timeout) {

            function getDirections(navLink)
            {
                if (Settings.userNavApp() != 'Google')
                    navLink = navLink.replace('google',Settings.userNavApp());

                window.open(navLink, '_system', 'location=yes');
            }

            var success_callback = function(position){

                Centers.getByLocation(position.coords.latitude, position.coords.longitude)
                    .then(function (centers) {
                            $scope.data = {centerData: centers};
                            $scope.getDirections = getDirections;
                        },
                        function (statusCode) {
                            var statusMessage = 'Server Error:  ' + statusCode;
                            if (statusCode == '404')
                                statusMessage = 'Could not connect to server.  Please make sure you have network connectivity.';

                            $ionicPopup.alert({
                                title: 'Server Error: ' + statusCode,
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

            $scope.refreshCenterList = function() {
                Location.getCurrentPosition().then(
                    success_callback,
                    error_callback
                );
                $scope.$broadcast('scroll.refreshComplete');
            };

            Location.getCurrentPosition().then(
                success_callback,
                error_callback
            );


        });
