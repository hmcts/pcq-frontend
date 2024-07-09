(function() {
    'use strict';

    const backButton = document.querySelector('#start-back-button');
    const back = function (e) {
        e.preventDefault();
        fetch('/start-page-back-service');
        window.history.back();
    };

    backButton.addEventListener('click', back);
    backButton.addEventListener('touchstart', back);
}).call(this);