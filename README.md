# Protected Characteristics Questionnaire

This is the frontend for the protected characteristics questionnaire service. This service will ask a set of questions that will help us check we are treating people fairly and equally. It helps us to meet our commitment to equality (under the Equality Act 2010). 

## Getting Started

### Prerequisites

- [Node.js](nodejs.org) >= 12.15.0
- [yarn](yarnpkg.com)

### Installation

Install dependencies by executing the following command:
```
$ yarn install
```

Sass:
```
$ yarn setup
```

Build a git.properties.json by running the following command:
```
$ yarn git-info
```

Git hooks:

We have git hooks that enforce rules for commit messages.

These can be activated by running the following commands:
```
$ ln -s ./pre-commit.sh .git/hooks/pre-commit
$ ln -s ./commit-msg.sh .git/hooks/commit-msg
```

### Running the application

Run the application local server:
```
$ yarn start
```

Open [https://localhost:4000](https://localhost:4000) in a browser

## Developing

### Code style

`eslint` is a pre-commit requirement which is automatically run. This can be run manually using with `$ yarn lint`.

We have a number of rules relating to code style that can be found in [.eslintrc.js](.eslintrc.js).

### Config

For development only config, use the `dev.yaml` file. Running the app using `$ yarn start:dev` will set the node environment to `dev` to use this config.
This file is not version controlled so any config here will not be pushed to git.

As an example, if you want to use LanuchDarkly locally, place the SDK Key in this file. You can keep the key there as this file is not version controlled.

### Running the tests

Mocha is used for writing tests.

The test suite can be run with:
`$ yarn test`

For unit tests:
`$ yarn test:unit`

For component tests:
`$ yarn test:component`

For accessibility tests:
`$ yarn test:a11y`

For test coverage:
`$ yarn test:coverage`

## Registering a service with PCQ

When your service has got approval and is ready to integrate with PCQ 
you will firstly need to add your service to the [registered service JSON file](app/registeredServices.json).
Add a new object to the array with your service id, list of actors, and redirect links. 
The redirect link property name must match the property name of the [shutter page text](app/resources/en/translation/shutterpage.json) which will hold the link.
This property will define the name for the service when the user is on the shutter page in the case where the parameters have been lost. property is also added to the welsh resources.

When the PCQ service endpoint is called it will verify the serviceId that has been passed and is in the list of registered services. If it's not, the user will be shown the 'service down' page. 
The redirect link is used in case there is a problem with PCQ and the users session has been lost. In this case PCQ will not know the return url, that was passed in the invocation parameters, and will instead show a list of registered services and their associated redirect link. 

There are 3 pages which require specific wording regarding your service. 
Please see the [Variable text README](app/resources/en/translation/variable/README.md) for adding your services text.

The phone number for the service's accessibility helpline needs to be added to the [resource file](app/resources/en/translation/static/accessibility.json). 
Ensure this is also added to the welsh translations file. Once added, the [template](app/steps/ui/static/accessibility/template.html) will need to be updated to add the new line in. 
Add `content["list2-<service-name>"]` to the 2 unordered lists.

If there are questions you want to be excluded from the questionnaire because they are irrelevant (such as asking someone if they are married when coming from the divorce app), 
please see the [Journey README](app/journeys/README.md) for creating a service specific journey.

### Token key

A new token key will need to be added in order to generate the token that authenticates the invoking service with PCQ.
This key is shared with the invoking service.

The following changes will need to be made to setup the token key in PCQ:

1. [Default config](config/default.yaml): Add a new property for the service in the `tokenKeys` object. 
Set the value to `SERVICE_TOKEN_KEY`, this is the default key we use and will inform the logs if AKS is not being used.
2. [Environment config](config/custom-environment-variables.yaml): Add a new property in the `tokenKeys` object with the same name as created in the default.yaml file.
Set the value with the convention `<SERVICE_NAME>_TOKEN_KEY`.
3. [Chart values](charts/pcq-frontend/values.yaml): Add a new entry to `keyVaults.pcq.secrets` with the following convention `<service_name>-token-key`
4. [Secrets setup](app/setupSecrets.js): Add a new line under Token Keys comment with the following content: `setSecret('secrets.pcq.<Azure KeyVault Key Name>', 'tokenKeys.<Config property name>'); // SERVICE NAME`
The Azure KeyVault key name was defined in step 3. The Config property name was defined in step 1 and 2.

IMPORTANT: This token key will also need to be added to the invoking service.

## Test

The following change need to made so that test will pass.

1. Add the new service in (test/unit/util/testInvoker.js.)
2. Add the new service redirect link in (test/unit/util/testShutterPage.js)
3. Add the new service rediret link property name in (test/component/testShutterPage.js)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.
