/* ===========================================================================
 * Donation Detector
 * ===========================================================================
 * Copyright 2016 Ray Nowell
 * Licensed under MIT
 * =========================================================================== */
'use strict';
var ddApp = angular.module('donationDetectorApplication', ['ionic']);

ddApp.run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

        .state('tab', {
            url: "/tab",
            abstract: true,
            templateUrl: "app/shared/tabs.html"
        })

        .state('tab.gps', {
            url: '/gps',
            views: {
                'tab-gps': {
                    templateUrl: 'app/gps/tab-gps.html',
                    controller: 'GpsCtrl'
                }
            }
        })

        .state('tab.centers', {
            url: '/centers',
            views: {
                'tab-centers': {
                    templateUrl: 'app/centers/tab-centers.html',
                    controller: 'CentersCtrl'
                }
            }
        })

        .state('tab.schedule', {
            url: '/schedule',
            views: {
                'tab-schedule': {
                    templateUrl: 'app/schedule/tab-schedule.html',
                    controller: 'ScheduleCtrl'
                }
            }
        })

        .state('tab.settings', {
        url: '/settings',
        views: {
            'tab-settings': {
                templateUrl: 'app/settings/tab-settings.html',
                controller: 'SettingsCtrl'
            }
        }
    });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/gps');


    });
