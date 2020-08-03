const html = require('html-template-tag');
const layout = require('../layout');

module.exports = () =>
  layout(html`<div class="gol-body">
    <div id="gol-container">
      <h1>Game Of Life</h1>
      <table id="board"></table>

      <div id="control_panel">
        <button id="step_btn" class="button">Step</button>
        <button id="play_btn" class="button">Play/Pause</button>
        <button id="random_btn" class="button">Randomize Board</button>
        <button id="clear_btn" class="button">Clear</button>
      </div>

      <footer></footer>
    </div>
    <script src="/golMain.js" defer></script>
  </div>`);
