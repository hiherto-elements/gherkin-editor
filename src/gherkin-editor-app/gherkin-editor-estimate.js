import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

class GherkinEditorEstimate extends PolymerElement {
    static get properties() {
        return {
          featureList: {
            type: Array,
            notify: true,
            observer: '_changeFeature'
          },
        }
    }

    _changeFeature() {
        this.$.list.items = this.featureList;
    }

    _randomEstimate() {
        let fib = [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100];
        return fib[Math.floor(Math.random() * fib.length)];
    }

    static get template() {
        return html`
        <paper-button>Rate</paper-button></dom-bind>
            <vaadin-grid id="list" aria-label="Feature Rating" items="{{featureList}}">
        
              <vaadin-grid-column width="60px" flex-grow="0">
                <template class="header">#</template>
                <template>[[index]]</template>
                <template class="footer">#</template>
              </vaadin-grid-column>
        
              <vaadin-grid-column width="200px">
                <template class="header">Senario</template>
                <template>[[item.scenario]]</template>
                <template class="footer">Scenario</template>
              </vaadin-grid-column>
        
              <vaadin-grid-column>
                <template class="header">Feature</template>
                <template>[[item.feature]]</template>   </gherkin-editor-nav>
            <paper-menu-button>
              <paper-icon-button id="btnshare" name="share" slot="dropdown-trigger" icon="social:share"></paper-icon-button>
           
                <template class="footer">Feature</template>
              </vaadin-grid-column>
              <vaadin-grid-column>
                <template class="header">Value</template>
                <template>
                  <paper-input class="value" value="[[_randomEstimate()]]"></paper-input>
                </template>
                <template class="footer">Value</template>
              </vaadin-grid-column>
              <vaadin-grid-column>
                <template class="header">Penalty</template>
                <template>
                  <paper-input class="penalty" value="[[_randomEstimate()]]"></paper-input>
                </template>
                <template class="footer">Penalty</template>
              </vaadin-grid-column>
              <vaadin-grid-column>
                <template class="header">Effort</template>
                <template>
                  <paper-input class="effort" value="[[_randomEstimate()]]"></paper-input>
                </template>
                <template class="footer">Effort</template>
              </vaadin-grid-column>
              <vaadin-grid-column>
                <template class="header">Risk</template>
                <template>
                  <paper-input class="effort" value="[[_randomEstimate()]]"></paper-input>
                </template>
                <template class="footer">Risk</template>
              </vaadin-grid-column>
            </vaadin-grid>  
        `;
    }
}

window.customElements.define('gherkin-editor-estimate', GherkinEditorEstimate);