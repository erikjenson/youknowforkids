const html = require('html-template-tag');
const layout = require('../layout');

module.exports = () =>
  layout(html`
    <div class="pixel-container">
      <div class="pixel-body">
        <h1>Pixelate</h1>
        <div>
          <span for="num-col"># of Columns:</span>
          <input type="number" class="num-col" name="num-col" />
          <button id="add-row">Add a row</button>
          <select class="color-option">
            <option value="clear">Clear w/Color</option>
            <option value="fill">Fill w/Color</option>
          </select>
          <select class="color">
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="purple">Purple</option>
            <option value="orange">Orange</option>
            <option value="black">Black</option>
            <option value="white">White</option>
          </select>
        </div>
        <table class="pix"></table>
      </div>
      <script src="/pixelscript.js" defer></script>
    </div>
  `);
