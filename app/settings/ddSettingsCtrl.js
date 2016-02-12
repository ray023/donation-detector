/* ===========================================================================
 * Donation Detector
 * ===========================================================================
 * Copyright 2016 Ray Nowell
 * =========================================================================== */
'use strict';
ddApp
    .controller('SettingsCtrl', function ($scope, Settings) {

        $scope.data = {
            userNavApp: Settings.userNavApp(),
            mileageThreshold: Settings.getMileageThreshold(),
            mileageThresholdList: [
                { text: "10", value: "10" },
                { text: "25", value: "25" },
                { text: "50", value: "50" },
                { text: "Unlimited", value: "25000" }
            ],
            navOptions: [
                {text: "Google", value: "Google", icon: "ion-social-google-outline"},
                {text: "Apple", value: "Apple", icon: "ion-social-apple-outline"}
            ]
        };
        $scope.saveMileageThreshold = function (value) {Settings.saveMileageThreshold(value)};
        $scope.saveUserNavApp = function (value) {Settings.saveUserNavApp(value)};
    });

