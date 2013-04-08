require(
['sounds', 'help', 'license', 'ui', 'pages'],
function (Sounds, help_init, license_init, ui_init, pagesLoader) {
  // when all HTML is loaded, augment the DOM with event
  // handlers and load text files
  pagesLoader(function () {
    ui_init();

    license_init("license", "main_page");

    help_init("main_help", "help_");
    help_init("lvl1_help", "help_");
    help_init("lvl2_help", "help_");
    help_init("lvl3_help", "help_");

    // pre-load all sounds used in the game
    Sounds.loadAll();
  });
});
