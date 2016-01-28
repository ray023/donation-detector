/* ===========================================================================
 * Donation Detector
 * ===========================================================================
 * Copyright 2016 Ray Nowell
 * =========================================================================== */
'use strict';
ddApp
    .controller('SettingsCtrl', function($scope, Settings) {

    $scope.data = {
        userNavApp: Settings.userNavApp(),
        navOptions: [
            { text: "Google", value: "Google" , icon: "ion-social-google-outline"},
            { text: "Apple", value: "Apple", icon: "ion-social-apple-outline"}
        ]
    };
    $scope.saveUserNavApp = function(value){Settings.saveUserNavApp(value)};
});

