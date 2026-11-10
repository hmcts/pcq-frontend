import Service from './Service.js';

class FormData extends Service {
    post(token, correlationId, data = {}) {
        const url = this.endpoint + this.config.services.pcqBackend.paths.forms;
        this.log('Post application form data');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            'X-Correlation-Id': correlationId
        };

        const fetchOptions = this.fetchOptions(data, 'POST', headers);
        return this.fetchJson(url, fetchOptions);
    }
}

export default FormData;
