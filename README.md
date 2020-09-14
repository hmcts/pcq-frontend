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
The redirect link property name must match the property name of the [shutter page text](app/resources/en/translation/shutterpage.json) which will hold the link 

When the PCQ service endpoint is called it will verify the serviceId that has been passed and is in the list of registered services. If it's not, the user will be shown the 'service down' page. 
The redirect link is used in case there is a problem with PCQ and the users session has been lost. In this case PCQ will not know the return url, that was passed in the invocation parameters, and will instead show a list of registered services and their associated redirect link. 

There are 3 pages which require specific wording regarding your service. 
Please see the [README](app/resources/en/translation/variable/README.md) for adding your services text.

If there are questions you want to be excluded from the questionnaire because they are irrelevant (such as asking someone if they are married when coming from the divorce app), 
please see the [README](app/journeys/README.md) for creating a service specific journey.



## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details
