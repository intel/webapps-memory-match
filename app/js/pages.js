/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

define(['appframework'], function ($) {
  var init = function (doneCb) {
    $.ajax({
      url: './pages.html',

      success: function (result) {
        $('#container').append(result);
        setTimeout(doneCb, 0);
      }
    });
  };

  return init;
});
