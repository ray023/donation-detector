/* ===========================================================================
 * Donation Detector
 * ===========================================================================
 * Copyright 2016 Ray Nowell
 * =========================================================================== */
'use strict';

ddApp

    .factory('Settings', function() {

        var LocalStorageConstants = {
            BOX_RESULT_COUNT: 'box_result_count',
            DRIVES_DETECTOR_URL: 'http://o1solutionlifesouthdonorweb.azurewebsites.net/api/BloodMobileDrives',
            CENTERS_DETECTOR_URL: 'http://o1solutionlifesouthdonorweb.azurewebsites.net/api/DonationCenters',
            USER_NAV_APP: 'user_nav_app'
        };

        return {
            getDrivesUrl: function(){return LocalStorageConstants.DRIVES_DETECTOR_URL;},
            getCentersUrl: function(){return LocalStorageConstants.CENTERS_DETECTOR_URL;},
            userNavApp: function() {
                var platform_default = device.platform == 'iOS' ? 'Apple' : 'Google';
                return localStorage.getItem(LocalStorageConstants.USER_NAV_APP) === null ? platform_default : localStorage.getItem(LocalStorageConstants.USER_NAV_APP);
            },
            saveUserNavApp: function(value) {
                localStorage.setItem(LocalStorageConstants.USER_NAV_APP,value);
            }
        }
    });
