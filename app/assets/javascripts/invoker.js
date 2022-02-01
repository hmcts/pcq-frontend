// Hide coookie banner on invoker page.
document.getElementById("cm-cookie-banner").style.display = "none";

// ------------ Actor Select ------------
(function () {
    'use strict';

    function changeActorList(service) {
        const actorListRaw = document.querySelector('#invoker-script').innerHTML;
        const actorList = actorListRaw ? JSON.parse(actorListRaw.trim()) : [];

        if (actorList.length === 0) {
            document.querySelector('#actor-select').innerHTML = '';
        } else {
            let options = '';
            for (const actor in actorList[service]) {
                options += `<option value="${actorList[service][actor]}">${actorList[service][actor]}</option>`;
            }
            document.querySelector('#actor-select').innerHTML = options;
        }

        // Set selected actor if possible
        const actorInputValue = document.querySelector('#actor').value;
        if (actorList[service].includes(actorInputValue)) {
            document.querySelector('#actor-select').value = actorInputValue;
        }
    }

    // Add onChange event listener
    document.querySelector('#service-select')
        .addEventListener('change', (evt => changeActorList(evt.target.value)));
    // Initialise the select options
    window.onload = () => changeActorList(document.querySelector('#service-select').value);

}).call(this);

// ------------ Clear ------------
(function() {
    'use strict';

    const clearButton = document.querySelector('#clear-btn');
    const form = document.getElementById('invoker-form');

    const clear = function (e) {
        e.preventDefault();
        // Reset() does not clear hidden inputs so the csrf value is safe.
        form.reset();
    };

    clearButton.addEventListener('click', clear);
    clearButton.addEventListener('touchstart', clear);

}).call(this);

// ------------ Fill ------------
(function () {
    'use strict';

    const fillButton = document.querySelector('#fill-btn');

    const fill = function (e) {
        e.preventDefault();

        const inputFields = document.getElementById('invoker-form').getElementsByTagName('input');
        const emptyFields = [];
        for (const field of inputFields) {
            if (field.value.length === 0) {
                emptyFields.push(field.name);
            }
        }

        const service = document.querySelector('#service-select').value;
        const actor = document.querySelector('#actor-select').value;

        const formFillerUrl = `/invoker/formFiller?service=${service}&actor=${actor}&fields=${emptyFields.join(',')}`;
        fetch(formFillerUrl).then(function (res) {
            res.json().then(function (json) {
                Object.keys(json).forEach(key => {
                    const input = document.getElementById(key);
                    if (input) {
                        input.value = json[key];
                    }
                });
            });
        });
    };

    fillButton.addEventListener('click', fill);
    fillButton.addEventListener('touchstart', fill);
}).call(this);

// ------------ Gen Token ------------
(function () {
    'use strict';

    const tokenGenButton = document.querySelector('#gen-token-btn');

    const generateToken = function (e) {
        e.preventDefault();

        const token = document.querySelector('#token');
        const authTag = document.querySelector('#authTag');
        const formInputs = document.getElementById('invoker-form').getElementsByTagName('input');

        const queries = [];
        for (const input of formInputs) {
            if (input.value.length !== 0 && input.name.match(/^(?!_csrf|token).+/gm)) {
                queries.push(input.name + '=' + encodeURIComponent(input.value));
            }
        }

        fetch(`/invoker/genToken?${queries.join('&')}`).then((res) => {
            res.json().then((json) => {
                token.value = json.token;
                authTag.value = json.authTag;
            });
        });
    };

    tokenGenButton.addEventListener('click', generateToken);
    tokenGenButton.addEventListener('touchstart', generateToken);
}).call(this);
