require(
['help', 'license', 'ui', 'pages'],
function (help_init, license_init, ui_init, pagesLoader) {
  pagesLoader.done(function () {
    ui_init();

    license_init("license", "main_page");

    help_init("main_help", "help_");
    help_init("lvl1_help", "help_");
    help_init("lvl2_help", "help_");
    help_init("lvl3_help", "help_");
  });
});
