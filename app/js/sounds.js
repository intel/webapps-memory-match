define(['gamesound'], function (GameSound) {
  var Sounds = {};

  var lvl_bg_sound = {
    1: new GameSound('audio/Nightsky.wav'),
    2: new GameSound('audio/Ocean.wav'),
    3: new GameSound('audio/Kitchen.wav')
  };

  var flip_sound = new GameSound("audio/FlipCard.wav");
  var match_sound = new GameSound("audio/GetMatch.wav");
  var mismatch_sound = new GameSound("audio/WrongLose.wav");
  var click_sound = new GameSound("audio/NavClick.wav");
  var win_sound = new GameSound("audio/WinLevel.wav");

  Sounds.click = function () {
    click_sound.play();
  };

  Sounds.flip = function () {
    flip_sound.play();
  };

  Sounds.win = function () {
    win_sound.play()
  };

  Sounds.match = function () {
    match_sound.play();
  };

  Sounds.mismatch = function () {
    mismatch_sound.play();
  };

  Sounds.pause_level_sound = function (level) {
    level = (typeof level === 'undefined' ? game_level : level);

    if (level > 0)
      lvl_bg_sound[level].pause();
  };

  Sounds.play_level_sound = function (level) {
    level = (typeof level === 'undefined' ? game_level : level);

    if (level > 0)
      lvl_bg_sound[level].play();
  };

  Sounds.stop_bg_sounds = function () {
    for (var i = 1; i <= 3; i++) {
      lvl_bg_sound[i].pause();
      if (lvl_bg_sound[i].currentTime > 0)
        lvl_bg_sound[i].currentTime = 0;
    }
  };

  return Sounds;
});
