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
    mutate:
        [
            'app/steps/ui/**/index.js',
            'app/middleware/*'
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
        '*.html',
        '*,json'
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
