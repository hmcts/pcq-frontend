module.exports = {
    packageManager: 'yarn',
    plugins: ['@stryker-mutator/mocha-runner'],
    reporters:
        [
            'clear-text',
            'progress',
            'html'
        ],
    htmlReporter: {fileName: 'functional-output/mutation-assets/index.html'},
    coverageAnalysis: 'perTest',
    mutator: {
        excludedMutations: ['ObjectLiteral'],
    },
    mutate:
        [
            'app/steps/ui/**/index.js',
            'app/middleware/*',
            '!**/*.html',
            '!app.js',
            '!**/*.mjs',
            '!**/*.json'
        ],
    ignorePatterns: [
        '**',
        '!app.js',
        '!server.js',
        '!package.json',
        '!version',
        '!app/**',
        '!config/*',
        '!test/**',
        'test/unit/core/testServiceData.json',
        'test/unit/services/testServiceInvokerData.json'
    ],
    testRunner: 'mocha',
    mochaOptions: {
        spec:
            [
                'test/component/**',
                'test/unit/**'
            ]
    },
    logLevel: 'debug'
};
