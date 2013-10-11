# INITIAL SET UP

To run the build, you'll need to install some node modules.
Run the following in the top-level directory of the project:

    npm install

grunt now requires that you install grunt-cli globally
to be able to use grunt from the command line. To install
grunt-cli do:

    npm install -g grunt-cli

You also need bower to install the client-side dependencies:

    npm install -g bower

Then install the client-side dependencies into app/lib:

    bower install

Note that if you want to install the application to a Tizen device
as a wgt file, you will also need to install the sdb tool first.
This is available for various platforms from
http://download.tizen.org/tools/latest-release/.

Configure your package manager to use the appropriate repo from the
ones available and install sdb, e.g. for Fedora 17:

    $ REPO=http://download.tizen.org/tools/latest-release/Fedora_17/tools.repo
    $ sudo yum-config-manager --add-repo $REPO
    $ sudo yum install sdb

# WHERE'S THE APP?

There are a few options for running the application:

*   Open app/index.html in a browser (there's no requirement to
    run a build before you can run the app).

*   Serve the app from a standard web server. First, run:

        grunt dist

    Then copy the content of the build/app/ directory to a web folder
    for your server (e.g. an Apache htdocs directory).

*   Run the app using the built-in local server:

        grunt server

    This builds the dist version of the app and runs it on a server
    accessible at http://localhost:30303/. This is useful for testing the
    app in a mobile device: just navigate to the server hosting
    the app, using the phone's browser.

*   Install/reinstall to an attached Tizen device via sdb by running:

        grunt wgt-install

    This installs an optimised version of the app (minified HTML,
    minified and concatenated CSS and JS).

*   Install an SDK-specific version of the app (no minification or
    concatenation) with:

        grunt sdk-install

*   Build the files for the Chrome extension with:

        grunt crx

    then load the build/crx directory as an unpacked extension in Chrome
    developer mode. (The build can't currently make full .crx packages.)

*   On Linux, use make to install the app to /usr/share/. If you are
    using the Chromium browser, you can use the Makefile as is; if not, edit the
    Makefile so the BROWSER= variable is set to the name of your Chrome
    binary (e.g. google-chrome instead of chromium-browser).

    Then do

        sudo make install

    to install the application. On Linux desktops which support the
    freedesktop.org specs, this will add the application to the standard
    application launcher.

# PACKAGING

The application can be packaged into a wgt (zip) file using the grunt
command:

    grunt wgt

This will generate a package in the build/ directory.

It can also be packaged into an SDK wgt file (with uncompressed JS,
CSS, and HTML) using:

    grunt sdk

Note that in both cases, the files comprising the packages are
first copied into the build/wgt and build/sdk directories respectively.

# REQUIRE AND ALMOND

During development, require is used to load modules. This makes
debugging easier, as you have the uncompressed JS files to look at.

For the optimised deployment targets (*not* the sdk targets),
the grunt requirejs task minifies all of the JS (from
app/js and app/lib) into a single file (./build/app.min.js), along
with a minimal AMD loader (Almond). grunt also rewrites the index.html
file so it will load this concatenated and minified single file,
rather than the full requirejs file (see the grunt-condense task).

# CACHING AND HOW TO BYPASS IT

To use the app in no-cache mode (so the browser doesn't cache
any JS files), open:

    index.html?nocache

This stops requirejs using cached copies of js files so you get
the most recent js each time you refresh the browser.

To use in normal (caching) mode, open:

    index.html

NB no-cache mode cannot be used if the app is running from a build
(i.e. code generated and put into build/app/, which is what the
simple_server task serves).

The code which looks for this URL argument is in the require configuration
file, app/js/require-config.js.

# ADDING YOUR OWN AMD MODULES

When using require in your own code, paths to modules should be
relative to the ./app/js/ directory. So, for example, imagine you're
defining a new module app/js/newmodule.js, which depends on
the module in app/js/mymodule.js. To load the dependency in
app/js/newmodule.js, you'd do this:

    // NB 'mymodule' is the path to app/js/mymodule.js, relative to app/js
    define(['mymodule'], function (MyModule) {
      var newmodule = {
        /*
           DEFINE NewModule HERE;
           in your definition of newmodule, you can make use
           of the MyModule dependency
        */
      };

      return NewModule;
    });

# ADDING THIRD PARTY LIBRARIES

Install the dependency (if possible) using bower:

    bower install ...package... --save

This will put the package into app/lib and save the dependency into
the component.json file.

You will then need to add a path and/or shim for the library into
app/js/require-config.js so it can be referenced by other modules.

# GUIDE FOR MS WINDOWS USERS AND TIZEN IDE

Here are some steps to help people wishing to generate code for use in the Tizen IDE on Microsoft Windows.

1. install git
1. get admin shell
1. click start
1. in ‘search’ type ‘command’ - don’t hit return/enter
1. ‘command prompt’ appears under ‘programs’ - right click on it and select ‘run as administrator’ - click ‘yes’ if it asks for confirmation
1. install grunt - type ‘npm install -g grunt’
1. install bower - type ‘npm install -g bower’
1. close admin shell
1. right click on desktop and select ‘git bash’
1. change directory to where you want your projects to go (or don’t, if Desktop is ok)
1. clone the repository, eg ‘git clone https://github.com/01org/webapps-annex.git’
1. cd webapps-annex
1. npm install
1. bower install
1. grunt sdk
1. the project is now built in build/sdk and can be imported into the IDE
1. launch Tizen IDE
1. File->New->Tizen Web Project
1. select all the files in the project and delete them
1. File->Import…->General->File System Next
1. “From directory” <- the build/sdk directory
1. “Into folder” <- the project you created in the IDE
1. Finish
