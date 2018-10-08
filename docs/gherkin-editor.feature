Feature: History
	As a User of gherkin-editor
	I want to have a edit History
	In order to keep track of changes

Scenario: Store last entry
	Given the user is editing a feature 
	When the feature is changed 
	Then the last entry is stored

Scenario: Display feature history
	Given the user is editing a feature 
	When the feature is changed 
	Then the feature history should show and entry

Scenario: Step to history
	Given the user is editing a feature 
	When the feature is changed 
	Then a new entry should be made into the history

Feature: Save and Load 
	As a User of gherkin-editor
	I want to be able to store feature and History
	In order to keep my changes between Sessions 

Scenario: Store feature
	Given the user is editing a feature 
	When the feature is changed 
	Then the history should be stored
	And Then the feature file should be stored

Scenario: Load feature file 
	Given the user starts the editor
	When the editor is initialized
	Then the last stored feature file is loaded

Feature: Share
	As a User of gherkin-editor
	I want to be able to share the page and my feature 
	In order to be able to communicate with others

Scenario: Share to twitter
	Given the user starts the editor
	When he uses the share function
	Then he is displayed a twitter share button

Feature: Timer 
	As a User of gherkin-editor
	I want to be able to set a Timer
	In order to have a way of focussed working

Scenario: Start timer 

Scenario: Stopt timer 

Scenario: Show histogram with time data 

Feature: Editor

Scenario: Make sound on change 

Scenario: Autosave history and feature 

Scenario: Display outline 

Scenario: Display Test Suite
