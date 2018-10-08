import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/social-icons.js';
import '@polymer/iron-icons/editor-icons.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/marked-element/marked-element.js';
import '@polymer/iron-pages/iron-pages.js';
import '@granite-elements/ace-widget/ace-widget.js'

// gherkin parser
import { parse } from '@hiherto-elements/gherkin/parse.js'; 
import { stats } from '@hiherto-elements/gherkin/stats.js';

let DEFAULT_FEATURE = `Feature: History
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

`;

class GherkinEditorApp extends PolymerElement {

  ready() {
    super.ready();
    this.$.editor.addEventListener('editor-content', (event)=>{
      this.featureText = event.detail.value;
    });

    this.$.btnscore.addEventListener('click', (event)=>{
      this.page = 3;
    });

    this.$.btnshare.addEventListener('click', (event)=>{
        this.page = 2;
    });
    
    this.$.btntimer.addEventListener('click', (event)=>{
      this.page = 1;
    });

    this.$.btnhelp.addEventListener('click', (event)=>{
      this.page = 0;
    });
  }

  static get template() {
    return html`
 <style>
      app-header {
        background-color: #00897B;
        color: #fff;
      }
      paper-icon-button {
        --paper-icon-button-ink-color: white;
      }
      app-drawer-layout:not([narrow]) [drawer-toggle] {
        display: none;
      }
    </style>
      <app-header-layout>
        <app-header slot="header" reveals effects="waterfall">
          <app-toolbar>
            <div main-title>Gherkin Editor</div>
            <paper-icon-button id="btnhelp" name="help" icon="icons:help"></paper-icon-button>
            <paper-icon-button id="btntimer" name="timer" icon="icons:hourglass-full"></paper-icon-button>
            <paper-icon-button id="btnshare" name="share" icon="social:share"></paper-icon-button>
            <paper-button id="btnscore" >Score {{featureStats.score}}</paper-button> 
          </app-toolbar>
        </app-header>
        <iron-pages selected="{{page}}">
          <div>
            <marked-element>
              <div slot="markdown-html"></div>
              <script src="./docs/help.md" type="text/markdown"></script>
            </marked-element>
          </div>
          <div>
            <paper-button>Start Timer</paper-button>
            
          </div>
          <div>Share</div>
          <ace-widget id="editor" placeholder="{{featureText}}" on-editor-content="{{changeContent}}"></ace-widget>
        </iron-pages>
        
      </app-header-layout>
    `;
  }

  changeFeature() {
    this.parsedFeature = parse(this.featureText);
    this.featureStats = stats(this.parsedFeature);
    this.$.editor.value = this.featureText;
  }

  _goto(page) {
    this.page = page;
  }

  static get properties() {
    return {
      page: {
        type: Number,
        value: 3,
        notify: true,
      },
      parsedFeature: {
        type: Object,
      },
      featureStats: {
        type: Object,
        value: ()=>{
          return {
        
          }
        }
      },
      featureText: {
        type: String,
        observer: 'changeFeature',
        notify: true,
        value: function() {
          return DEFAULT_FEATURE;
        }
      }
    };
  }
}

window.customElements.define('gherkin-editor-app', GherkinEditorApp);
