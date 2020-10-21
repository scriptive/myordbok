// NOTE: helps to prevent -> 404 Not Found (style.css)
// import './middleware.css';
// import middleware from './middleware.css';
// @import 'middleware.css' => require('./middleware.css')

// NOTE: Main
require('./index.js');
require('./middleware.css');

// import './index.js';

// var h1 = document.getElementById('delete');
// h1.style.color = 'red';
//
/* eslint-env browser */
// var app = document.getElementById('bar');
// var time = document.getElementById('time');
// //
// var timer = setInterval(updateClock, 1000);
//
// function updateClock() {
//   h1.innerHTML = (new Date()).toString();
// }

// Edit these styles to see them take effect immediately
// app.style.display = 'table-cell';
// app.style.width = '400px';
// app.style.height = '400px';
// app.style.border = '3px solid #339';
// app.style.background = '#99d';
// time.style.color = 'red';
// app.style.textAlign = 'center';
// app.style.verticalAlign = 'middle';

// Uncomment one of the following lines to see error handling
// require('unknown-module')
// } syntax-error

// Uncomment this next line to trigger a warning
// require('Assert');
// require('./middlewareChild');
// require('assert');

if (module.hot) {
  module.hot.accept();
  module.hot.dispose(function() {
    // clearInterval(timer);
  });
}