const html = require('html-template-tag');
const layout = require('../layout');

module.exports = () =>
  layout(html` <div class="coffee-body">
    <h1>Coffee Clicker</h1>
    <div class="column-container">
      <div class="column">
        <div class="container left">
          <div class="counter-container">
            Coffee: <span id="coffee_counter">0</span>
          </div>
          <div class="cps-container"><span id="cps">0</span> coffee/second</div>
          <div id="big_coffee">☕️</div>
        </div>
      </div>
      <div class="column">
        <div class="column-header">Coffee Producers</div>
        <div class="container right" id="producer_container"></div>
      </div>
      <script type="text/javascript" src="coffeescript.js" defer></script>
    </div>
  </div>`);
