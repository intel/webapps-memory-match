define(['jqmobi'], function ($) {
  var init = function (doneCb) {
    $.ajax({
      url: './pages.html',

      success: function (result) {
        $('body').append(result);
        setTimeout(doneCb, 0);
      }
    });
  };

  return init;
});
