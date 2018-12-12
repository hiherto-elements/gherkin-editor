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
        value: 0
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

    this.$.btnhelp.addEventListener('click', (event)=>{
      this.page = 0;
    });

    this.$.btnscore.addEventListener('click', (event)=>{
      this.page = 3;
    });
    this.$.btnvalue.addEventListener('click', (event)=>{
      this.page = 4;
    });

    this.$.editor.addEventListener('editor-content', (event)=>{
      this.featureText = event.detail.value;
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
            <paper-icon-button id="btnvalue" name="value" icon="editor:attach-money"></paper-icon-button>
            <paper-menu-button>
              <paper-icon-button id="btntimer" name="share" slot="dropdown-trigger" icon="icons:hourglass-full"></paper-icon-button>
              <paper-listbox slot="dropdown-content">
                <paper-item on-click="_timerStart">Start 15 Minutes</paper-item>
                <paper-item on-click="_timerStop">Stop</paper-item>
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
          <div>
            <vaadin-grid id="list" aria-label="Feature Rating" items="{{featureList}}">
        
              <vaadin-grid-column width="60px" flex-grow="0">
                <template class="header">#</template>
                <template>[[index]]</template>
                <template class="footer">#</template>
              </vaadin-grid-column>
        
              <vaadin-grid-column>
                <template class="header">Senario</template>
                <template>[[item.scenario]]</template>
                <template class="footer">Scenario</template>
              </vaadin-grid-column>
        
              <vaadin-grid-column>
                <template class="header">Feature</template>
                <template>[[item.feature]]</template>
                <template class="footer">Feature</template>
              </vaadin-grid-column>
              <vaadin-grid-column>
                <template class="header">Value</template>
                <template>
                  <paper-input class="value" value="[[item.value]]"></paper-input>
                </template>
                <template class="footer">Value</template>
              </vaadin-grid-column>
              <vaadin-grid-column>
                <template class="header">Penalty</template>
                <template>
                  <paper-input class="penalty" value="[[item.penalty]]"></paper-input>
                </template>
                <template class="footer">Penalty</template>
              </vaadin-grid-column>
              <vaadin-grid-column>
                <template class="header">Effort</template>
                <template>
                  <paper-input class="effort" value="[[item.effort]]"></paper-input>
                </template>
                <template class="footer">Effort</template>
              </vaadin-grid-column>
              <vaadin-grid-column>
                <template class="header">Risk</template>
                <template>
                  <paper-input class="effort" value="[[item.risk]]"></paper-input>
                </template>
                <template class="footer">Risk</template>
              </vaadin-grid-column>
            </vaadin-grid>  <dom-bind>
          <template>
        
  
          </div>
        </iron-pages>
        
      </app-header-layout>
    `;
  }

  changeFeature() {
    try {
      this.parsedFeature = parse(this.featureText);
      this.featureStats = stats(this.parsedFeature);
      this.featureList = list(this.parsedFeature);

      this.$.editor.value = this.featureText;
      this.$.list.items = this.featureList;
      
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
