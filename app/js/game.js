/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

define(['jqmobi', 'sounds'], function ($, Sounds) {
    var Game = {};

    Game.infocus = true;
    Game.win_level = 0;
    Game.ignore = false;
    Game.fliptime = 400;

    var matchcard = undefined;
    var game_level = -1;

    var gamedata = {
      1: {
        cardcount : 8
      },
      2:{
        cardcount : 12
      },
      3: {
        cardcount : 16
      }
    };

    function input_on() {
      ignore = false;
    }

    function input_off() {
      ignore = true;
    }

    function cardEntry(classname) {
      this.classname = classname;
      this.flipped = false;
    }

    function win_dlg(lvl) {
        Game.win_level = lvl;

        if (window.chrome && window.chrome.i18n)
        {
            if (lvl < 3)
                $("#win_btn2").text(chrome.i18n.getMessage("win_nextlevel"));
            else
                $("#win_btn2").text(chrome.i18n.getMessage("win_backtostart"));
            $("#win_btn1").text(chrome.i18n.getMessage("win_replay"));
            $("#win_btn3").text(chrome.i18n.getMessage("win_quit"));
            $("#win_dlg_text").html(chrome.i18n.getMessage("win_text"));
        }
        else
        {
            if (lvl < 3)
                $("#win_btn2").text("NEXT LEVEL");
            else
                $("#win_btn2").text("BACK TO START");
        }

        Sounds.win();

        $("#win_dlg_page").show();
    }

    function update_matches(lvl) {
        var flipcount = 0;
        var cardcount = gamedata[lvl].cardcount;
        $(".flip").each(function() { flipcount++; });
        var matches = (flipcount/2)|0;
        var possible_matches = (cardcount/2)|0;

        /* set the match text */
        if (window.chrome&&window.chrome.i18n)
        {
            $("#lvl"+lvl+"_matches").text(chrome.i18n.getMessage("matches")+" "+
             chrome.i18n.getMessage("num"+matches)+"/"+
             chrome.i18n.getMessage("num"+possible_matches));
        }
        else
        {
            $("#lvl"+lvl+"_matches").text("Matches "+matches+"/"+possible_matches);
        }

        return (flipcount >= cardcount);
    }

    function card_flipped(newcard) {
        Sounds.flip();

        /* ignore clicks during flip */
        Game.input_off();

        /* set the function to be called after the animation has done */
        window.setTimeout(function () {
          var lvl = parseInt(newcard.substring(3, 4));

          if (matchcard != undefined)
          {
              var newclass = $("#"+newcard+" .front").attr("class");
              var matchclass = $("#"+matchcard+" .front").attr("class");

              if(newclass == matchclass)
              {
                  /* good match */
                  if(update_matches(lvl))
                  {
                      win_dlg(lvl);
                  }
                  else
                  {
                      Sounds.match();
                      input_on();
                  }
              }
              else
              {
                  /* bad match */
                  Sounds.mismatch();
                  $("#"+newcard).removeClass('flip');
                  $("#"+matchcard).removeClass('flip');

                  /* keep ignoring input til the cards are flipped back */
                  window.setTimeout(Game.input_on, Game.fliptime);
              }

              /* reset the match card */
              matchcard = undefined;
          }
          else
          {
              /* first card in match attempt, set it and wait */
              matchcard = newcard;
              input_on();
          }
        }, Game.fliptime);
    }

    function generate_hint(lvl) {
        if(matchcard != undefined)
        {
            var matchclass = $("#"+matchcard+" .front").attr("class");
            $(".lvl"+lvl+"_card").each(function() {
                var newcard = $(this).attr("id");
                var newclass = $("#"+newcard+" .front").attr("class");
                if((matchclass == newclass)&&(matchcard != newcard))
                {
                    /* ignore clicks while hint is generated */
                    input_off();

                    /* flip the card's match for the poor child */
                    Sounds.flip();
                    $("#"+newcard).addClass('flip');

                    if(update_matches(lvl))
                    {
                        Sounds.match()
                        window.setTimeout(function () {
                          Game.win_dlg(lvl);
                        }, Game.fliptime);
                    }
                    else
                    {
                        Sounds.match()
                        window.setTimeout(Game.input_on, Game.fliptime);
                    }
                }
            });
            matchcard = undefined;
        }
        else
        {
            var cardlist = new Array();
            $(".lvl"+lvl+"_card").each(function() {
                if(!$(this).hasClass('flip'))
                    cardlist.push($(this).attr("id"));
            });

            /* if all cards are flipped, return */
            if(cardlist.length <= 0)
                return;

            var target = (Math.random() * cardlist.length)|0;
            var tgtcard = cardlist[target];
            var tgtclass = $("#"+tgtcard+" .front").attr("class");

            $(".lvl"+lvl+"_card").each(function() {
                var newcard = $(this).attr("id");
                var newclass = $("#"+newcard+" .front").attr("class");
                if((tgtclass == newclass)&&(tgtcard != newcard))
                {
                    /* ignore clicks while hint is generated */
                    input_off();

                    /* flip two cards for the poor child */
                    Sounds.flip();
                    $("#"+tgtcard).addClass('flip');
                    $("#"+newcard).addClass('flip');

                    if(update_matches(lvl))
                    {
                        Sounds.match()
                        window.setTimeout(function () {
                          Game.win_dlg(lvl);
                        }, Game.fliptime);
                    }
                    else
                    {
                        Sounds.match()
                        window.setTimeout(Game.input_on, Game.fliptime);
                    }
                }
            });
        }
    }

    function start_game(lvl) {
        Sounds.click();
        Sounds.stop_bg_sounds();
        Sounds.play_level_sound(lvl);

        game_level = lvl;

        /* reset all the cards */
        $(".card").removeClass('flip');

        var types = new Array();
        var cardcount = gamedata[lvl].cardcount;
        var cardtypes = gamedata[lvl].cardcount / 2;
        var i, j;

        if (window.chrome&&window.chrome.i18n)
        {
            $("#lvl"+ lvl +"_matches").text(chrome.i18n.getMessage("matches") + " " +
                chrome.i18n.getMessage("num0")+"/"+
                chrome.i18n.getMessage("num"+cardtypes));
        }
        else
        {
            $("#lvl"+ lvl +"_matches").text("Matches 0/"+cardtypes);
        }

        /* create a list of cards by index */
        for (i = 0; i < cardcount; i++)
            types.push((i%cardtypes)+1);

        /* randomly fill out the deck */
        for(i = 0; i < cardcount; i++)
        {
            var card_id = "#lvl" + lvl + "_card" + (i + 1) + " .front";
            var target = (Math.random() * types.length) | 0;
            var idx = types.splice(target, 1);
            var card_class = "front lvl" + lvl + "_card_type" + idx;
            $(card_id).attr('class', card_class);
        }

        input_on();
    }

    var set_level = function (level) {
      game_level = level;
    };

    var quit = function () {
      Sounds.stop_bg_sounds();
      Sounds.click();
      $("#win_dlg_page").hide();
      $("#lvl1_page").hide();
      $("#lvl2_page").hide();
      $("#lvl3_page").hide();
      $("#main_page").show();
      set_level(-1);
    };

    Game.card_flipped = card_flipped;
    Game.input_on = input_on;
    Game.input_off = input_off;
    Game.win_dlg = win_dlg;
    Game.start_game = start_game;
    Game.set_level = set_level;
    Game.generate_hint = generate_hint;
    Game.quit = quit;

    Game.unfocus = function () {
      if (Game.infocus) {
        Game.infocus = false;
        Sounds.pause_level_sound(Game.win_level);
      }
    };

    Game.focus = function () {
      if (!Game.infocus) {
        Game.infocus = true;
        Sounds.play_level_sound(Game.win_level);
      }
    };

    return Game;
});
