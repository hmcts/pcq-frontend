import js from "@eslint/js";
import globals from "globals";

const config = {

    languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: {
            ...globals.browser,
            ...globals.mocha,
            ...globals.node,
            'actor': true,
            'Feature': true,
            'Scenario': true,
            'codecept_helper': true
        }
    },
};

export default [
    js.configs.recommended,
    config,
    {
        ignores: [
            'govuk/*',
            'public/*',
            'app/assets/javascripts/*.js',
            'coverage',
            'functional-output/*',
            '.pnp.cjs',
            '.pnp.loader.mjs',
            '.stryker-tmp'
        ]
    }
];
