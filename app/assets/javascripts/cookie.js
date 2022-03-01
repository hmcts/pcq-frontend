(function() {
    'use strict';
    const cookieManager = require('@hmcts/cookie-manager');

    const cookieBanner = document.querySelector('#cm-cookie-banner');
    const cookieBannerDecision = cookieBanner?.querySelector('.cm-cookie-banner__decision');
    const cookieBannerConfirmation = cookieBanner?.querySelector('.cm-cookie-banner__confirmation');
    const cookieBannerAccepted = document.querySelector('#cm-accepted-cookies');
    const cookieBannerRejected = document.querySelector('#cm-rejected-cookies');

    function cookieBannerAccept() {
        cookieBannerAccepted.hidden = false;
        cookieBannerRejected.hidden = true;
    }

    function cookieBannerReject() {
        cookieBannerAccepted.hidden = true;
        cookieBannerRejected.hidden = false;
    }

    function cookieBannerSaved() {
        cookieBannerDecision.hidden = true;
        cookieBannerConfirmation.hidden = false;
    }

    function preferenceFormSaved() {
        const message = document.querySelector('.cookie-preference-success');
        message.style.display = 'block';
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }

// @ts-ignore
    function cookiePreferencesUpdated(cookieStatus) {
        const dataLayer = window.dataLayer || [];
        const dtrum = window.dtrum;

        dataLayer.push({ event: 'Cookie Preferences', cookiePreferences: cookieStatus });

        if (dtrum !== undefined) {
            if (cookieStatus.apm === 'on') {
                dtrum.enable();
                dtrum.enableSessionReplay();
            } else {
                dtrum.disable();
                dtrum.disableSessionReplay();
            }
        }
    }

    console.log('*PCQ* Initialising Cookie Manager...');
    cookieManager.init({
        'user-preference-cookie-name': 'pcq-cookie-preferences',
        'user-preference-saved-callback': cookiePreferencesUpdated,
        'preference-form-id': 'cm-preference-form',
        'preference-form-saved-callback': preferenceFormSaved,
        'set-checkboxes-in-preference-form': true,
        'cookie-banner-id': 'cm-cookie-banner',
        'cookie-banner-visible-on-page-with-preference-form': false,
        'cookie-banner-reject-callback': cookieBannerReject,
        'cookie-banner-accept-callback': cookieBannerAccept,
        'cookie-banner-saved-callback': cookieBannerSaved,
        'cookie-banner-auto-hide': false,
        'cookie-manifest': [
            // Additional GA cookies will need to be added here
            {
                'category-name': 'essential',
                optional: false,
                cookies: ['pcq-cookie-preferences', 'pcq-session', 'Idam.Session', 'seen_cookie_message', '_oauth2_proxy'],
            },
            {
                'category-name': 'analytics',
                optional: true,
                cookies: ['_ga', '_gid'],
            },
            {
                'category-name': 'apm',
                optional: true,
                cookies: ['dtCookie', 'dtLatC', 'dtPC', 'dtSa', 'rxVisitor', 'rxvt'],
            },
        ],
    });
}).call(this);