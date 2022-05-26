(function() {
    'use strict';

    const optOutButton = document.querySelector('[name="opt-out-button"]');
    let runOptOutDtrum = true;

    const getAllCookies = function () {
        return decodeURIComponent(document.cookie)
            .split(';')
            .map(cookie => cookie.trim())
            .filter(cookie => cookie.length)
            .map(cookie => {
                const cookieComponents = cookie.split(/=(.*)/).map(component => component.trim());
                return { name: cookieComponents[0], value: cookieComponents[1] };
            });
    }

    const getCookie = function (name) {
        return getAllCookies().filter(cookie => cookie.name === name)[0];
    }

    const enterRumAction = function (e) {
        if (runOptOutDtrum) {
            e.preventDefault();
            optOutButton.disabled = true;

            const dtrum = window.dtrum;
            if (dtrum !== undefined) {
                let cookieStatus = getCookie('pcq-cookie-preferences');
                cookieStatus = cookieStatus.value ? JSON.parse(cookieStatus.value) : null;

                if (cookieStatus && cookieStatus.apm === 'on') {
                    dtrum.enterAction('PCQ Opt-out')
                }
            }

            runOptOutDtrum = false;
            optOutButton.disabled = false;
            optOutButton.click();
        } else {
            runOptOutDtrum = true;
            // Runs the form submit with opt-out form action
        }
    };

    optOutButton.addEventListener('click', enterRumAction);
    optOutButton.addEventListener('touchstart', enterRumAction);
}).call(this);
