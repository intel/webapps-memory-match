define(function () {
  var constructor = function (file) {
    this.soundobj = new Audio(file);
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
  };

  return constructor;
});
