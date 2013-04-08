define(function () {
  // done(GameSound) is a callback invoked with the created GameSound object
  // when the corresponding Audio object it wraps is playable
  var GameSound = function (file, done) {
    var self = this;
    var soundobj = new Audio(file);
    this.soundobj = soundobj;

    soundobj.addEventListener('canplay', function () {
      if (done) {
        done(self);
      }
    });

    this.isPlaying = false;

    this.play = function () {
      if (this.isPlaying) {
        this.soundobj.pause();
        this.soundobj.currentTime = 0;
      }

      /* create two instances of the file to play sequentially if calls */
      /* come too fast, otherwise the second call will be ignored */
      this.isPlaying = true;
      this.soundobj.play();
    };

    this.pause = function () {
      this.isPlaying = false;
      this.soundobj.pause();
    };

    this.stop = function () {
      this.pause();
      this.soundobj.currentTime = 0;
    };
  };

  return {
    create: function (file, cb) {
      return new GameSound(file, cb);
    }
  };
});
