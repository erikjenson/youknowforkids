const layout = require('./layout');
const html = require('html-template-tag');

module.exports = () =>
  layout(html`<div class="img-container">
    <img src="/photo.jpg" />
  </div>`);
