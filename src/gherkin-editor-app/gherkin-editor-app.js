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
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '@polymer/app-storage/app-indexeddb-mirror/app-indexeddb-mirror.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/social-icons.js';
import '@polymer/iron-icons/editor-icons.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/marked-element/marked-element.js';
import '@polymer/iron-pages/iron-pages.js';
import '@granite-elements/ace-widget/ace-widget.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';

// gherkin parser
import { parse } from '@hiherto-elements/gherkin/parse.js'; 
import { stats } from '@hiherto-elements/gherkin/stats.js';
import { list } from '@hiherto-elements/gherkin/list.js';

import { Diff } from '@hiherto-elements/diff/diff.js';
import {feature as DEFAULT_FEATURE } from './feature.js';

import './gherkin-editor-nav.js';
import './gherkin-editor-estimate.js';


class GherkinEditorApp extends PolymerElement {

  static get properties() {
    return {
      timeout: {
        type: Object
      },
      interval: {
        type: Object
      },
      timeleft: {
        type: Number, 
        value: 0,
      },
      revisions: {
        type: Array,
        notify: true,
        value: ()=>{
          return [];
        }
      },
      page: {
        type: Number,
        value: 3,
        notify: true,
      },
      parsedFeature: {
        type: Object,
      },
      featureList: {
        type: Array,
        notify: true
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


  ready() {
    super.ready();
    
    this.$.editor.addEventListener('editor-content', (event)=>{
      this.featureText = event.detail.value;
    });

    this.$.nav.addEventListener('nav-value', (event)=>{
      this.page = 4;
    });

    this.$.nav.addEventListener('nav-score', (event)=>{
      this.page = 3;
    });

    this.$.nav.addEventListener('nav-help', (event)=>{
      this.page = 0;
    });

  }

  static get template() {
    return html`
    <style>
      app-header-layout  {
        height: 100%;
      }
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
            <gherkin-editor-nav id="nav"
              feature-stats="[[featureStats]]"
              parsed-feature="[[parsedFeature]]"
              feature-text="[[featureText]]"
              ></gherkin-editor-nav>
           
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
          <div>
            <gherkin-editor-estimate id="estimate"></gherkin-editor-estimate>
  
          </div>
        </iron-pages>
        
      </app-header-layout>
    `;
  }

  _randomEstimate() {
    let fib = [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100];
    return fib[Math.floor(Math.random() * fib.length)];
  }
  changeFeature() {
    try {
      this.parsedFeature = parse(this.featureText);
      this.featureStats = stats(this.parsedFeature);
      this.featureList = list(this.parsedFeature);

      this.$.editor.value = this.featureText;
      this.$.estimate.featureList = this.featureList;
      
      
      this.push('revisions', this.featureText);

      let lastRevisionIndex =  this.revisions.length-1;
      let olderRevisionIndex =  this.revisions.length-2;
      
      let last = this.revisions[lastRevisionIndex];
      let older = this.revisions[olderRevisionIndex]; 
      if (typeof last !== 'undefined' && typeof older !== 'undefined') {
        let d = new Diff();
        let res = d.diff(last, older);
        console.log(res)
      }
    } catch(e) {
      console.log(e)
    }
  }

  _goto(page) {
    this.page = page;
  }

  _timerStart() {
    function timer(callback, delay) {
      var id, started, remaining = delay, running
  
      this.start = function() {
          running = true
          started = new Date()
          id = setTimeout(callback, remaining)
      }
  
      this.pause = function() {
          running = false
          clearTimeout(id)
          remaining -= new Date() - started
      }
  
      this.getTimeLeft = function() {
          if (running) {
              this.pause()
              this.start()
          }
  
          return remaining
      }
  
      this.getStateRunning = function() {
          return running
      }
  
      this.start()
  }

  this.timeout = new timer(function() {    
    alert('done');
  }, 1000*60*15);
  
  }
  _timerStop() {    
    this.timeout.pause();
    alert('Stopped');
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
}

window.customElements.define('gherkin-editor-app', GherkinEditorApp);
