import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-menu-button/paper-menu-button.js';

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
import {feature as DEFAULT_FEATURE } from './feature.js';

class GherkinEditorApp extends PolymerElement {

  ready() {
    super.ready();
    this.$.editor.addEventListener('editor-content', (event)=>{
      this.featureText = event.detail.value;
    });

    this.$.btnscore.addEventListener('click', (event)=>{
      this.page = 3;
    });

    this.$.btnhelp.addEventListener('click', (event)=>{
      this.page = 0;
    });
  }

  static get template() {
    return html`
    <style>
        app-header {
            color: white;
            background-color: #ef6c00;
            --app-header-background-rear-layer: {
              background-color: #ef6c00;
            };
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
            <paper-menu-button>
              <paper-icon-button id="btnshare" name="share" slot="dropdown-trigger" icon="social:share"></paper-icon-button>
              <paper-listbox slot="dropdown-content">
                <paper-item on-click="_downloadJson">Save as JSON</paper-item><a id="download"></a>
                <paper-item on-click="_downloadText">Save as feature</paper-item>
              </paper-listbox>
            </paper-menu-button>
            <paper-icon-button id="btnhelp" name="help" icon="icons:help"></paper-icon-button>
            <paper-menu-button>
              <paper-icon-button id="btntimer" name="share" slot="dropdown-trigger" icon="icons:hourglass-full"></paper-icon-button>
              <paper-listbox slot="dropdown-content">
                <paper-item>Start</paper-item>
                <paper-item>Stop</paper-item>
                <paper-item>Time Left: 00:00</paper-item>
              </paper-listbox>
            </paper-menu-button>
            <paper-menu-button>
              <paper-button id="btnscore" slot="dropdown-trigger">Score {{featureStats.score}}</paper-button> 
              <paper-listbox slot="dropdown-content">
                <paper-item>Features {{featureStats.features}}</paper-item>
                <paper-item>Scenarios {{featureStats.scenarios}}</paper-item>
                <paper-item>Revisions {{revisions.length}}</paper-item>
              </paper-listbox>
            </paper-menu-button>
 
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
    try {
      this.parsedFeature = parse(this.featureText);
      this.featureStats = stats(this.parsedFeature);
      this.$.editor.value = this.featureText;
      this.push('revisions', this.featureText)
    } catch(e) {
      console.log(e)
    }
  }

  _goto(page) {
    this.page = page;
  }

  _downloadJson() {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.parsedFeature));
    var dlAnchorElem = this.$.download;
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "feature.json");
    dlAnchorElem.click();
  }

  _downloadText() {
    var dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(this.featureText);
    var dlAnchorElem = this.$.download;
    dlAnchorElem.setAttribute("href",dataStr);
    dlAnchorElem.setAttribute("download", "feature.feature");
    dlAnchorElem.click();
  }


  static get properties() {
    return {

      revisions: {
        type: Array, 
        value: [],
      },
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
