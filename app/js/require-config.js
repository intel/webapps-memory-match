require.config({
  baseUrl: './js',

  deps: ['main'],

  paths: {
    'domReady': '../lib/requirejs-domready/domReady',
    'jquery': '../lib/jquery/jquery'
  },

  shim: {
  }
});

(function () {
  // this is here as the r.js optimiser uses the first require.config
  // call in the file to configure its build (i.e. to minify and concat
  // all the JS files used by the app via require); the argument passed
  // to that first call must be valid JSON, and the below config is not
  var urlArgs = (document.location.href.match(/nocache/) ?
                 'bust=' + (new Date()).getTime() :
                 '');

  require.config({urlArgs: urlArgs});
})();
