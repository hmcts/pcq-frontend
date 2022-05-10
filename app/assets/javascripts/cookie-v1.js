import cookieManager from '@hmcts/cookie-manager-v1';

/**
 * NOTE: This file must conform to the ECMAScript 2016 standard!
 * You can use https://esprima.org/demo/validate.html to check for conformity.
 */
(function () {
    'use strict';
    console.log('Initialising Cookie Manager V1');

    cookieManager.on('UserPreferencesLoaded', (preferences) => {
        const dataLayer = window.dataLayer || [];
        dataLayer.push({'event': 'Cookie Preferences', 'cookiePreferences': preferences});
    });

    cookieManager.on('UserPreferencesSaved', (preferences) => {
        const dataLayer = window.dataLayer || [];
        const dtrum = window.dtrum;

        dataLayer.push({'event': 'Cookie Preferences', 'cookiePreferences': preferences});

        if(dtrum !== undefined) {
            if(preferences.apm === 'on') {
                dtrum.enable();
                dtrum.enableSessionReplay(true);
            } else {
                dtrum.disableSessionReplay();
                dtrum.disable();
            }
        }
    });

    cookieManager.on('PreferenceFormSubmitted', () => {
        const message = document.querySelector('.cookie-preference-success');
        message.style.display = 'block';
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    });

    cookieManager.init({
        userPreferences: {
            cookieName: 'pcq-cookie-preferences',
        },
        cookieManifest: [
            {
                categoryName: 'essential',
                optional: false,
                cookies: ['pcq-cookie-preferences', 'pcq-session', 'Idam.Session', 'seen_cookie_message', '_oauth2_proxy'],
            },
            {
                categoryName: 'analytics',
                cookies: ['_ga', '_gid', '_gat_UA-'],
            },
            {
                categoryName: 'apm',
                cookies: ['dtCookie', 'dtLatC', 'dtPC', 'dtSa', 'rxVisitor', 'rxvt'],
            },
        ],
    });
}).call(this);