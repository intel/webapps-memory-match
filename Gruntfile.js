module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-tizen');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadTasks('tools/grunt-tasks');

  grunt.initConfig({
    packageInfo: grunt.file.readJSON('package.json'),
    chromeInfo: grunt.file.readJSON('data/chrome-crx/manifest.json'),

    clean: ['build'],

    tizen_configuration: {
      // location on the device to install the tizen-app.sh script to
      // (default: '/tmp')
      tizenAppScriptDir: '/home/developer/',

      // path to the config.xml file for the Tizen wgt file - post templating
      // (default: 'config.xml')
      configFile: 'build/wgt/config.xml',

      // path to the sdb command (default: process.env.SDB or 'sdb')
      sdbCmd: 'sdb'
    },

    requirejs: {
      dist: {
        options: {
          baseUrl: './app/js',

          // include the main requirejs configuration file;
          // see notes in that file on the allowed format
          mainConfigFile: 'app/js/require-config.js',

          // main application module
          name: 'main',

          // output
          out: 'build/app.min.js',

          // we don't need to wrap the js in an anonymous function,
          // as our main.js runs the application
          wrap: false,

          // remove license comments from js files
          preserveLicenseComments: false,

          uglify: {
            beautify: false,
            toplevel: true,
            ascii_only: true,
            no_mangle: false,
            max_line_length: 1000
          }
        }
      }
    },

    // minify almond
    uglify: {
      dist: {
        files: {
          'build/almond.min.js': [
            'app/lib/almond/almond.js'
          ]
        }
      }
    },

    // concat minified almond with minified source
    concat: {
      dist: {
        files: {
          'build/app/js/all.js': [
            'build/almond.min.js',
            'build/app.min.js'
          ]
        }
      }
    },

    // minify and concat CSS
    cssmin: {
      dist: {
        files: {
          'build/app/css/all.css': ['app/css/*.css']
        }
      }
    },

    // copy files required for the wgt package
    copy: {
      common: {
        files: [
          { expand: true, cwd: '.', src: ['app/audio/**'], dest: 'build/' },
          { expand: true, cwd: '.', src: ['app/font/**'], dest: 'build/' },
          { expand: true, cwd: '.', src: ['README.txt'], dest: 'build/app/' }
        ]
      },

      wgt: {
        files: [
          { expand: true, cwd: 'build/app/', src: ['**'], dest: 'build/wgt/' },
          { expand: true, cwd: '.', src: ['icon_128.png'], dest: 'build/wgt/' }
        ]
      },

      wgt_config: {
        files: [
          { expand: true, cwd: 'data/tizen-wgt/', src: ['config.xml'], dest: 'build/wgt/' }
        ],
        options:
        {
          processContent: function(content, srcpath)
          {
            return grunt.template.process(content);
          }
        }
      },

      crx: {
        files: [
          { expand: true, cwd: 'build/app/', src: ['**'], dest: 'build/crx/' },
          { expand: true, cwd: '.', src: ['icon*.png'], dest: 'build/crx/' }
        ]
      },

      crx_manifest:
      {
        files: [
          { expand: true, cwd: 'data/chrome-crx/', src: ['manifest.json'], dest: 'build/crx/' }
        ],

        options:
        {
          processContent: function(content, srcpath)
          {
            return grunt.template.process(content);
          }
        }

      },

      xpk: {
        files: [
          { expand: true, cwd: 'build/app/', src: ['**'], dest: 'build/xpk/' },
          { expand: true, cwd: '.', src: ['icon*.png'], dest: 'build/xpk/' }
        ]
      },

      xpk_manifest:
      {
        files: [
          { expand: true, cwd: 'data/tizen-xpk/', src: ['manifest.json'], dest: 'build/xpk/' }
        ],

        options:
        {
          processContent: function(content, srcpath)
          {
            return grunt.template.process(content);
          }
        }

      },

      sdk: {
        files: [
          { expand: true, cwd: 'build/app/', src: ['**'], dest: 'build/sdk/' },
          { expand: true, cwd: 'app/', src: ['js/**'], dest: 'build/sdk/' },
          { expand: true, cwd: 'app/', src: ['css/**'], dest: 'build/sdk/' },
          { expand: true, cwd: 'app/', src: ['*.html'], dest: 'build/sdk/' },
          {
            src: 'app/lib/appframework/appframework.js',
            dest: 'build/sdk/lib/appframework/appframework.js'
          },
          {
            src: 'app/lib/requirejs/require.js',
            dest: 'build/sdk/lib/requirejs/require.js'
          },
          {
            src: 'app/lib/requirejs-domready/domReady.js',
            dest: 'build/sdk/lib/requirejs-domready/domReady.js'
          },
          { expand: true, cwd: 'data/tizen-wgt/', src: ['config.xml'], dest: 'build/sdk/' },
          { expand: true, cwd: '.', src: ['icon.png'], dest: 'build/sdk/' },
          { expand: true, cwd: '.', src: ['LICENSE'], dest: 'build/sdk/' },
          { expand: true, cwd: '.', src: ['OFL.txt'], dest: 'build/sdk/' }
        ]
      }
    },

    htmlmin: {
      dist: {
        files: [
          { expand: true, cwd: '.', src: ['app/*.html'], dest: 'build/' }
        ],
        options: {
          removeComments: true,
          collapseWhitespace: true,
          removeCommentsFromCDATA: false,
          removeCDATASectionsFromCDATA: false,
          removeEmptyAttributes: true
        }
      }
    },

    // replace stylesheet and js elements
    condense: {
      dist: {
        file: 'build/app/index.html',
        script: 'js/all.js',
        stylesheet: 'css/all.css'
      }
    },

    imagemin: {
      dist: {
        options: {
          optimizationLevel: 3,
          progressive: true
        },
        files: [
          { expand: true, cwd: '.', src: ['app/images/**'], dest: 'build/' }
        ]
      }
    },

    // make wgt package in build/ directory
    package: {
      wgt: {
        appName: '<%= packageInfo.name %>',
        version: '<%= packageInfo.version %>',
        files: 'build/wgt/**',
        stripPrefix: 'build/wgt/',
        outDir: 'build',
        suffix: '.wgt',
        addGitCommitId: false
      },
      sdk: {
        appName: '<%= packageInfo.name %>',
        version: '<%= packageInfo.version %>',
        files: 'build/sdk/**',
        stripPrefix: 'build/sdk/',
        outDir: 'build',
        suffix: '.wgt',
        addGitCommitId: false
      }
    },

    simple_server: {
      port: 30303,
      dir: 'build/app/'
    },

    tizen: {
      push: {
        action: 'push',
        localFiles: {
          pattern: 'build/*.wgt',
          filter: 'latest'
        },
        remoteDir: '/home/developer/'
      },

      install: {
        action: 'install',
        remoteFiles: {
          pattern: '/home/developer/<%= packageInfo.name %>*.wgt',
          filter: 'latest'
        }
      },

      uninstall: {
        action: 'uninstall'
      },

      start: {
        action: 'start',
        stopOnFailure: true
      },

      stop: {
        action: 'stop',
        stopOnFailure: false
      },

      debug: {
        action: 'debug',
        browserCmd: 'google-chrome %URL%',
        localPort: 9090,
        stopOnFailure: true
      }
    },

  });

  grunt.registerTask('dist', [
    'clean',
    'copy:common',
    'imagemin:dist',
    'requirejs:dist',
    'uglify:dist',
    'concat:dist',
    'cssmin:dist',
    'htmlmin:dist',
    'condense'
  ]);

  grunt.registerTask('crx', ['dist', 'copy:crx', 'copy:crx_manifest']);
  grunt.registerTask('wgt', ['dist', 'copy:wgt', 'copy:wgt_config', 'package:wgt']);
  grunt.registerTask('xpk', ['dist', 'copy:xpk', 'copy:xpk_manifest']);
  grunt.registerTask('sdk', [
    'clean',
    'copy:common',
    'imagemin:dist',
    'copy:sdk',
    'copy:wgt_config',
    'package:sdk'
  ]);

  grunt.registerTask('install', [
    'tizen:push',
    'tizen:stop',
    'tizen:uninstall',
    'tizen:install',
    'tizen:start'
  ]);

  grunt.registerTask('restart', ['tizen:stop', 'tizen:start']);

  grunt.registerTask('server', ['dist', 'simple_server']);

  grunt.registerTask('wgt-install', ['wgt', 'install']);
  grunt.registerTask('sdk-install', ['sdk', 'install']);

  grunt.registerTask('default', 'wgt');
};
