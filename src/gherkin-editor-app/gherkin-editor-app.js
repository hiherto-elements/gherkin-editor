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
            <paper-icon-button id="btnhelp" icon="icons:help"></paper-icon-button>
            <paper-icon-button id="btntimer" icon="icons:hourglass-full"></paper-icon-button>
            <paper-icon-button id="btnshare" icon="social:share"></paper-icon-button>
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
