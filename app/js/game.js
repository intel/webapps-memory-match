/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

define(['jquery', 'gamesound'], function ($, GameSound) {
    var Game = {};

    Game.infocus = true;
    Game.win_level = 0;
    Game.ignore = false;
    Game.fliptime = 400;

    var matchcard = undefined;
    var game_level = -1;

    var lvl_bg_sound = {
      1: new GameSound('audio/Nightsky.wav'),
      2: new GameSound('audio/Ocean.wav'),
      3: new GameSound('audio/Kitchen.wav')
    };

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

    var flip_sound = new GameSound("audio/FlipCard.wav");
    var match_sound = new GameSound("audio/GetMatch.wav");
    var mismatch_sound = new GameSound("audio/WrongLose.wav");
    var click_sound = new GameSound("audio/NavClick.wav");
    var win_sound = new GameSound("audio/WinLevel.wav");

    function stop_bg_sounds() {
      for (var i = 1; i <= 3; i++) {
        lvl_bg_sound[i].pause();
        if (lvl_bg_sound[i].currentTime > 0)
          lvl_bg_sound[i].currentTime = 0;
      }
    }

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

        win_sound.play();

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
                    match_sound.play();
                    input_on();
                }
            }
            else
            {
                /* bad match */
                mismatch_sound.play();
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
                    flip_sound.play();
                    $("#"+newcard).addClass('flip');

                    if(update_matches(lvl))
                    {
                        match_sound.play();
                        window.setTimeout(function () {
                          Game.win_dlg(lvl);
                        }, Game.fliptime);
                    }
                    else
                    {
                        match_sound.play();
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
                    flip_sound.play();
                    $("#"+tgtcard).addClass('flip');
                    $("#"+newcard).addClass('flip');

                    if(update_matches(lvl))
                    {
                        match_sound.play();
                        window.setTimeout(function () {
                          Game.win_dlg(lvl);
                        }, Game.fliptime);
                    }
                    else
                    {
                        match_sound.play();
                        window.setTimeout(Game.input_on, Game.fliptime);
                    }
                }
            });
        }
    }

    function play_click() {
      click_sound.play();
    }

    function play_flip() {
      flip_sound.play();
    };

    function start_game(lvl) {
        play_click();
        stop_bg_sounds();
        play_level_sound(lvl);

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

    var pause_level_sound = function (level) {
      level = (typeof level === 'undefined' ? game_level : level);

      if (level >= 0)
        lvl_bg_sound[level].pause();
    };

    var play_level_sound = function (level) {
      level = (typeof level === 'undefined' ? game_level : level);

      if (level >= 1)
        lvl_bg_sound[level].play();
    };

    var quit = function () {
      stop_bg_sounds();
      play_click();
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
    Game.stop_bg_sounds = stop_bg_sounds;
    Game.set_level = set_level;
    Game.pause_level_sound = pause_level_sound;
    Game.play_level_sound = play_level_sound;
    Game.generate_hint = generate_hint;
    Game.play_click = play_click;
    Game.play_flip = play_flip;
    Game.quit = quit;

    return Game;
});
