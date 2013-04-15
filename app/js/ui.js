/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

// links the Game object to the UI and directly
// sets up event handlers on the DOM
define(['game', 'jqmobi', 'domReady!'], function (Game, $) {
  var ui_init = function () {
    if (window.chrome && window.chrome.i18n) {
      $("#lvl1_quit").html("&nbsp;&nbsp;&nbsp;"+chrome.i18n.getMessage("quit"));
      $("#lvl2_quit").html("&nbsp;&nbsp;&nbsp;"+chrome.i18n.getMessage("quit"));
      $("#lvl3_quit").html("&nbsp;&nbsp;&nbsp;"+chrome.i18n.getMessage("quit"));
      $("#lvl1_hint").text(chrome.i18n.getMessage("hint"));
      $("#lvl2_hint").text(chrome.i18n.getMessage("hint"));
      $("#lvl3_hint").text(chrome.i18n.getMessage("hint"));
      $("#main_lvl1btn").text(chrome.i18n.getMessage("level1"));
      $("#main_lvl2btn").text(chrome.i18n.getMessage("level2"));
      $("#main_lvl3btn").text(chrome.i18n.getMessage("level3"));
      $("#help_contents").html(chrome.i18n.getMessage("help_text"));
    }

    /* if a mouseup happens reset the buttons, this is to maintain */
    /* the original page state if a button is only half clicked */
    $("body").on('mouseup', function() {
      $('#main_lvl1btn').removeClass("main_lvl1btn_on");
      $('#main_lvl1btn').addClass("main_lvl1btn_off");
      $('#main_lvl2btn').removeClass("main_lvl2btn_on");
      $('#main_lvl2btn').addClass("main_lvl2btn_off");
      $('#main_lvl3btn').removeClass("main_lvl3btn_on");
      $('#main_lvl3btn').addClass("main_lvl3btn_off");
    });

    $('#win_dlg_page').on('mouseup', function() {
      $('#win_btn1').removeClass("win_btn1_on");
      $('#win_btn1').addClass("win_btn1_off");
      $('#win_btn2').removeClass("win_btn2_on");
      $('#win_btn2').addClass("win_btn2_off");
      $('#win_btn3').removeClass("win_btn3_on");
      $('#win_btn3').addClass("win_btn3_off");
    });

    /* game launch buttons */
    $('#main_lvl1btn').click(function() {
      $("#main_page").hide();
      $("#lvl1_page").show();
      Game.start_game(1);
    });

    $('#main_lvl2btn').click(function() {
      $("#main_page").hide();
      $("#lvl2_page").show();
      Game.start_game(2);
    });

    $('#main_lvl3btn').click(function() {
      $("#main_page").hide();
      $("#lvl3_page").show();
      Game.start_game(3);
    });

    /* setup for game pages */
    $('.quit').click(Game.quit);

    $('.hintrays').click(function() {
      if (!Game.ignore) {
        var id = $(this).attr("id");
        Game.generate_hint(parseInt(id.substring(3, 4)));
      }
    });

    $('.card').click(function(){
      var self = $(this);
      var id = self.attr('id');

      if (!Game.ignore && !($(this).hasClass('flip'))) {
        /* start the flip animation */
        self.addClass('flip');
        Game.card_flipped(id);
      }
    });

    // buttons on the popup shown when level is complete
    $("#win_btn1").click(function() {
      $("#win_dlg_page").hide();
      $(".card").removeClass('flip');
      window.setTimeout(function () {
        Game.start_game(Game.win_level);
      }, Game.fliptime);
    });

    $("#win_btn2").click(function() {
      var next_level = Game.win_level + 1;
      if (next_level > 3) {
        next_level = 1;
      }

      $("#win_dlg_page").hide();
      $("#lvl" + Game.win_level + "_page").hide();
      $("#lvl" + next_level + "_page").show();

      Game.start_game(next_level);
    });

    $("#win_btn3").click(Game.quit);

    window.onblur = function() {
      Game.unfocus();
    };

    window.onfocus = function() {
      Game.focus();
    };
  };

  return ui_init;
});
