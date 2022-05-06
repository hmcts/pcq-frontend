(function() {
    'use strict';

    const optOutButton = document.querySelector('[name="opt-out-button"]');
    let runOptOutDtrum = true;

    const enterRumAction = function (e) {
        if (runOptOutDtrum) {
            e.preventDefault();
            optOutButton.disabled = true;

            const dtrum = window.dtrum;
            if (dtrum !== undefined) {
                if (cookieStatus.apm === 'on') {
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
