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
                        var noCentersMsg = '';
                            if (centers.length == 0)
                                noCentersMsg = 'No donation centers could be found near your location.';
                            $scope.data = {
                                centerData: centers,
                                noCentersMsg: noCentersMsg
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
