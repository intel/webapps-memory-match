define(['jquery'], function ($) {
  var dfd = $.Deferred();

  $.ajax('./pages.html').then(function (result) {
    $('body').append(result);
    setTimeout(dfd.resolve, 0);
  });

  return dfd;
});
