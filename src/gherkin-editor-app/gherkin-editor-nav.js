import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

class GherkinEditorNav extends PolymerElement {
    static get properties() {
        return {
          featureStats: {
            type: Object
          },
          parsedFeature: {
            type: Object
          },
          featureText: {
            type: Object
          },
        }
    }

    ready() {
        super.ready();
        this.$.btnhelp.addEventListener('click', (event)=>{
            this.dispatchEvent(new CustomEvent('nav-help'));
        });
    
        this.$.btnscore.addEventListener('click', (event)=>{
            this.dispatchEvent(new CustomEvent('nav-score'));
        });
  
        this.$.btnvalue.addEventListener('click', (event)=>{
            this.dispatchEvent(new CustomEvent('nav-value'));
        });
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


    static get template() {
        return html`
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
              <paper-button id="btnscore" slot="dropdown-trigger">Score {{featureStats.score}}</paper-button> 
              <paper-listbox slot="dropdown-content">
                <paper-item>Features {{featureStats.features}}</paper-item>
                <paper-item>Scenarios {{featureStats.scenarios}}</paper-item>
                <paper-item>Revisions {{revisions.length}}</paper-item>
              </paper-listbox>
            </paper-menu-button>
 
        `;
    }
}
window.customElements.define('gherkin-editor-nav', GherkinEditorNav);