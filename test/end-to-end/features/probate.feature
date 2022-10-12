Feature: Probate
  As a probate service user
  I need an introduction page
  so that I know what the PCQ service is about.

  Scenario: User answer Yes to all pcq questions
    Given  I am a probate Citizen user
    When I invoke the PCQs task
    Then I am presented with the PCQ Intro page
    When I submit all pcq questions
    Then a record successfully created in database


  Scenario: User Answers Prefer not to say to all pcq questions
    Given  I am a probate Citizen user
    When I invoke the PCQs task
    Then I am presented with the PCQ Intro page
    When I submit prefer not to say for all pcq questions
    Then a record successfully created in database


  Scenario: User Answers No to all pcq questions
    Given  I am a probate Citizen user
    When I invoke the PCQs task
    Then I am presented with the PCQ Intro page
    When I submit No for all pcq questions
    Then a record successfully created in database

  Scenario: User answer Yes to all Welsh pcq questions
    Given  I am a probate Citizen user
    When I invoke the PCQs task
    Then I am presented with the PCQ Intro Welsh page
    When I submit all pcq questions
    Then a record successfully created in database

