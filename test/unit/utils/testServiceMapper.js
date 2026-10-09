import chai from 'chai';
import ServiceMapper from 'app/utils/ServiceMapper.js';
import FormData from 'app/services/FormData.js';

const { expect } = chai;

describe('ServiceMapper', () => {
    it('should return an instance of the requested service', async () => {
        const service = await ServiceMapper.map('FormData', ['http://localhost', 'sid123']);
        expect(service).to.be.an.instanceof(FormData);
    });

    it('should pass params to the service constructor', async () => {
        const service = await ServiceMapper.map('FormData', ['http://localhost', 'sid123']);
        expect(service.endpoint).to.equal('http://localhost');
        expect(service.sessionId).to.equal('sid123');
    });

    it('should reject when the service does not exist', async () => {
        let error;
        try {
            await ServiceMapper.map('DoesNotExist', []);
        } catch (err) {
            error = err;
        }
        expect(error).to.be.an('error');
    });
});