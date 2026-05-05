'use strict';

const expect = require('chai').expect;
const rewire = require('rewire');
const Invoker = require('app/utils/Invoker');

describe('Invoker', () => {
    let invoker;

    beforeEach(() => {
        invoker = new Invoker();
    });

    describe('fillForm() && formFiller()', () => {
        it('should fill all fields when they are empty', (done) => {
            const service = 'SERVICE';
            const actor = 'ACTOR';
            const fields = ['serviceId', 'actor', 'pcqId', 'ccdCaseId', 'partyId', 'language', 'returnUrl', 'default'];

            const formFiller = invoker.fillForm(service, actor, fields);

            expect(formFiller.serviceId).to.equal('SERVICE');
            expect(formFiller.actor).to.equal('ACTOR');
            expect(formFiller.pcqId).to.not.be.empty;
            expect(formFiller.ccdCaseId).to.not.be.empty;
            expect(formFiller.partyId).to.equal('SERVICE_ACTOR@test.gov.uk');
            expect(formFiller.returnUrl).to.equal('SERVICE_ACTOR.test.gov.uk');
            expect(formFiller.language).to.equal('en');
            expect(formFiller.default).to.equal('');

            done();
        });
    });

    describe('serviceEndpoint()', () => {
        it('should generate the service endpoint url', (done) => {
            const form = {
                serviceId: 'a',
                actor: 'b',
                pcqId: 'c',
                ccdCaseId: 'd',
                partyId: 'e',
                returnUrl: 'f',
                language: 'g',
                _csrf: 'h',
            };

            const serviceEndpoint = invoker.serviceEndpoint(form);
            expect(serviceEndpoint).to.equal('/service-endpoint?serviceId=a&actor=b&pcqId=c&ccdCaseId=d&partyId=e&returnUrl=f&language=g');
            done();
        });

        it('should include secure token fields and exclude useSecureToken from service endpoint url', (done) => {
            const form = {
                serviceId: 'a',
                actor: 'b',
                token: 'token',
                authTag: 'auth-tag',
                iv: 'token-iv',
                salt: 'token-salt',
                useSecureToken: 'true',
                _csrf: 'h',
            };

            const serviceEndpoint = invoker.serviceEndpoint(form);
            expect(serviceEndpoint).to.equal('/service-endpoint?serviceId=a&actor=b&token=token&authTag=auth-tag&iv=token-iv&salt=token-salt');
            done();
        });
    });

    describe('generateToken()', () => {
        it('should use secure token generation when useSecureToken is true', () => {
            const InvokerRewired = rewire('app/utils/Invoker');
            const generateTokenStub = () => ({token: 'legacy'});
            const generateSecureTokenStub = () => ({token: 'secure', authTag: 'a', iv: 'i', salt: 's'});
            InvokerRewired.__set__('generateToken', generateTokenStub);
            InvokerRewired.__set__('generateSecureToken', generateSecureTokenStub);

            const rewiredInvoker = new (InvokerRewired)();
            const result = rewiredInvoker.generateToken({serviceId: 'A', useSecureToken: 'true'});

            expect(result).to.deep.equal({token: 'secure', authTag: 'a', iv: 'i', salt: 's'});
        });
    });

    describe('content()', () => {
        it('should return the correct content', (done) => {
            const ageCheckList = [
                {
                    'selected': true,
                    'text': 'NONE',
                    'value': null
                },
                {
                    'text': '> 18',
                    'value': 0
                },
                {
                    'text': '16 - 18',
                    'value': 1
                },
                {
                    'text': '< 16',
                    'value': 2
                }
            ];

            expect(invoker.content).to.deep.equal({
                serviceList: [
                    {
                        value: 'PROBATE',
                        text: 'PROBATE'
                    },
                    {
                        value: 'CMC',
                        text: 'CMC'
                    },
                    {
                        value: 'DIVORCE',
                        text: 'DIVORCE'
                    },
                    {
                        value: 'NEW_DIVORCE_LAW',
                        text: 'NEW_DIVORCE_LAW'
                    },
                    {
                        value: 'SSCS',
                        text: 'SSCS'
                    },
                    {
                        value: 'IAC',
                        text: 'IAC'
                    },
                    {
                        value: 'ADOPTION',
                        text: 'ADOPTION'
                    },
                    {
                        value: 'ET',
                        text: 'ET'
                    },
                    {
                        value: 'ONLINE_PLEA',
                        text: 'ONLINE_PLEA'
                    },
                    {
                        value: 'SpecialTribunals_CIC',
                        text: 'SpecialTribunals_CIC'
                    },
                    {
                        value: 'JurorDigital',
                        text: 'JurorDigital'
                    },
                    {
                        value: 'prl_ca',
                        text: 'prl_ca'
                    },
                    {
                        value: 'civil-citizen-ui',
                        text: 'civil-citizen-ui'
                    }
                ],
                ageCheckList,
                actorList: {
                    'PROBATE': [
                        'APPLICANT'
                    ],
                    'CMC': [
                        'CLAIMANT',
                        'DEFENDANT'
                    ],
                    'DIVORCE': [
                        'PETITIONER',
                        'RESPONDENT',
                        'CORESPONDENT'
                    ],
                    'NEW_DIVORCE_LAW': [
                        'APPLICANT',
                        'RESPONDENT',
                        'APPLICANT1',
                        'APPLICANT2'
                    ],
                    'SSCS': [
                        'APPELLANT'
                    ],
                    'IAC': [
                        'APPELLANT'
                    ],
                    'ADOPTION': [
                        'APPLICANT'
                    ],
                    'ET': [
                        'CLAIMANT'
                    ],
                    'ONLINE_PLEA': [
                        'DEFENDANT'
                    ],
                    'SpecialTribunals_CIC': [
                        'APPLICANT'
                    ],
                    'JurorDigital': [
                        'CITIZEN'
                    ],
                    'prl_ca': [
                        'APPLICANT',
                        'RESPONDENT'
                    ],
                    'civil-citizen-ui': [
                        'RESPONDENT',
                        'APPLICANT'
                    ]
                }
            });
            done();
        });
    });
});
