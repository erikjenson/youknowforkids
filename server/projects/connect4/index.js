const html = require('html-template-tag');
const layout = require('../layout');

module.exports = () =>
  layout(html`<div class="gol-body">

    <div id="gol-container">
      <h1>Connect 4</h1>
      <div id='winner' class="hidden">YOU WIN!</div>
      <div id="player_r" class="">Red's Turn</div>
      <div id="player_y" class="hidden">Yellow's Turn</div>
      <table id="connect" ></table>

      <div id="control_panel">
        <button id="restart_btn" class="button">Restart</button>
      </div>

      <footer></footer>
    </div>
    <script src="/connect.js" defer></script>
  </div>`);
