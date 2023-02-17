# Service Specific Journeys

If there are questions you want to be excluded from the questionnaire because they are irrelevant (such as asking someone if they are married when coming from the divorce app)
then please follow the instructions below. Otherwise, the default journey will be used.

### Adding a new service journey

To add a new service specific journey, start by copying the `default.js` file and renaming it to be your service id
(`<serviceid>.js`).

Inside this file is an object containing an ordered list of key/value pairs which represent a step and the step that you will directed to on post. 
Keys with an object as its value represent the various options that can be chosen in that step and the step that they will be directed to based on their choice.

As an example, if your service asks the user their date of birth and so asking it here is irrelevant, then you may want to remove the 'dateofbirth' step.
The default journey looks like this:
```
StartPage: 'ApplicantDateOfBirth',
ApplicantDateOfBirth: 'ApplicantLanguage',
ApplicantLanguage: {...}
```
To remove the date of birth step, simply remove the `ApplicantDateOfBirth` line and set the value of `StartPage` to `ApplicantLanguage`.
Here you're just saying, instead of directing me to the date of birth page, skip that and send me to the language question.
```
StartPage: 'ApplicantLanguage',
ApplicantLanguage: {...}
```
