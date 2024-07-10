(function() {
    'use strict';

    const backButton = document.querySelector('#back-button');
    const back = function (e) {
        e.preventDefault();
        const form = document.forms[0];
        if(form && form['action'] && form['action'].includes('start-page')){
            fetch('/start-page-back-service');
        }
        
        window.history.back();
    };

    backButton.addEventListener('click', back);
    backButton.addEventListener('touchstart', back);
}).call(this);
