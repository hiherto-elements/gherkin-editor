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
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@granite-elements/ace-widget/ace-widget.js'

// gherkin parser
import { parse } from '@hiherto-elements/gherkin/parse.js'

let DEFAULT_FEATURE = `Feature: Can drink beer when thirsty
As a drinker
I want to take beer off the wall
In order to satisfy my thirst

Scenario: Can take a single beer
  Given 100 bottles of beer on the wall
  When a bottle is taken down
  Then there are 99 bottles of beer on the wall
  And Then foo

Scenario: Bar
  Given 200 Bottles are sold
  When the Barkeeper deilvers them 
  Then the Baarkeeper is tired
`;

class GherkinEditorApp extends PolymerElement {

  ready() {
    super.ready();
    this.$.editor.addEventListener('editor-content', (event)=>{
      this.featureText = event.detail.value;
    })
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
            <paper-button>Features {{_countFeatures(parsedFeature)}}</paper-button>
          <paper-button>Scenarios {{_countScenarios(parsedFeature)}}</paper-button>           
          </app-toolbar>
        </app-header>
        <ace-widget id="editor" placeholder="{{featureText}}" on-editor-content="{{changeContent}}">{{featureText}}</ace-widget>
      </app-header-layout>
    `;
  }


  _countFeatures(parsedFeature) {
    if (!parsedFeature) {
      return;
    }
    return parsedFeature.length;
  }

  _countScenarios(parsedFeature) {
    
    if (!parsedFeature) {
      return;
    }
    const add = (a, b) => a + b;
    
    return parsedFeature.map(feature => feature.scenarios.length).reduce(add);
  }


  changeFeature() {
    this.parsedFeature = parse(this.featureText);
  }
  static get properties() {
    return {
      parsedFeature: {
        type: Object,
        observer: 'changeParsed',
      },
      featureText: {
        type: String,
        observer: 'changeFeature',
        value: function() {
          return DEFAULT_FEATURE;
        }
      }
    };
  }
}

window.customElements.define('gherkin-editor-app', GherkinEditorApp);
