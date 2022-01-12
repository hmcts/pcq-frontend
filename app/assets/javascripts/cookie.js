(function() {
    'use strict';
    const cookieManager = require('@hmcts/cookie-manager');

    const cookieBanner = document.querySelector('#pcq-cookie-banner');
    const cookieBannerDecision = cookieBanner?.querySelector('.govuk-cookie-banner__decision');
    const cookieBannerConfirmation = cookieBanner?.querySelector('.govuk-cookie-banner__confirmation');

    function cookieBannerAccept() {
        const confirmationMessage = cookieBannerConfirmation?.querySelector('p');
        confirmationMessage.innerHTML = 'You’ve accepted additional cookies. ' + confirmationMessage.innerHTML;
    }

    function cookieBannerReject() {
        const confirmationMessage = cookieBannerConfirmation?.querySelector('p');
        confirmationMessage.innerHTML = 'You’ve rejected additional cookies. ' + confirmationMessage.innerHTML;
    }

    function cookieBannerSaved() {
        cookieBannerDecision.hidden = true;
        cookieBannerConfirmation.hidden = false;
    }

    function preferenceFormSaved() {
        const message = qs('.cookie-preference-success');
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

    console.log('Initialising Cookie Manager...');
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
                cookies: ['pcq-cookie-preferences', 'pcq-session', 'Idam.Session', 'seen_cookie_message'],
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