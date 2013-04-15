/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

define(['gamesound'], function (GameSound) {
  var Sounds = {};

  var audioFilePaths = {
    lvl_1: 'audio/Nightsky.wav',
    lvl_2: 'audio/Ocean.wav',
    lvl_3: 'audio/Kitchen.wav',
    flip: 'audio/FlipCard.wav',
    match: 'audio/GetMatch.wav',
    mismatch: 'audio/WrongLose.wav',
    click: 'audio/NavClick.wav',
    win: 'audio/WinLevel.wav'
  };

  var audioFiles = {};

  var loadSound = function (key, done) {
    var path = audioFilePaths[key];

    audioFiles[key] = GameSound.create(path, function (audio) {
      if (done) {
        done(audio);
      }
    });
  };

  var playSound = function (key) {
    if (!audioFiles[key]) {
      loadSound(key, function (audio) {
        audio.play();
      });
    }
    else {
      audioFiles[key].play();
    }
  };

  var pauseSound = function (key) {
    if (audioFiles[key]) {
      audioFiles[key].pause();
    }
  };

  var stopSound = function (key) {
    if (audioFiles[key]) {
      audioFiles[key].stop();
    }
  };

  Sounds.click = function () {
    playSound('click');
  };

  Sounds.flip = function () {
    playSound('flip');
  };

  Sounds.win = function () {
    playSound('win');
  };

  Sounds.match = function () {
    playSound('match');
  };

  Sounds.mismatch = function () {
    playSound('mismatch');
  };

  Sounds.pause_level_sound = function (level) {
    level = (typeof level === 'undefined' ? game_level : level);

    if (level > 0)
      pauseSound('lvl_' + level);
  };

  Sounds.play_level_sound = function (level) {
    level = (typeof level === 'undefined' ? game_level : level);

    if (level > 0)
      playSound('lvl_' + level);
  };

  Sounds.stop_bg_sounds = function () {
    for (var i = 1; i <= 3; i++) {
      stopSound('lvl_' + i);
    }
  };

  // lazy load all sounds
  Sounds.loadAll = function () {
    for (var k in audioFilePaths) {
      loadSound(k);
    }
  };

  return Sounds;
});
