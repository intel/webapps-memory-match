module.exports = function (grunt) {

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

    clean: ['build'],

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
          { expand: true, cwd: 'data/', src: ['config.xml'], dest: 'build/wgt/' },
          { expand: true, cwd: '.', src: ['icon_128.png'], dest: 'build/wgt/' }
        ]
      },
      crx: {
        files: [
          { expand: true, cwd: 'build/app/', src: ['**'], dest: 'build/crx/' },
          { expand: true, cwd: 'app/_locales', src: ['**'], dest: 'build/crx/_locales' },
          { expand: true, cwd: '.', src: ['manifest.json'], dest: 'build/crx/' },
          { expand: true, cwd: '.', src: ['icon*.png'], dest: 'build/crx/' }
        ]
      },
      sdk: {
        files: [
          { expand: true, cwd: 'build/app/', src: ['**'], dest: 'build/sdk/' },
          { expand: true, cwd: 'app', src: ['js/**'], dest: 'build/sdk/' },
          { expand: true, cwd: 'app', src: ['css/**'], dest: 'build/sdk/' },
          { expand: true, cwd: 'app', src: ['*.html'], dest: 'build/sdk/' },
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
          { expand: true, cwd: 'data/', src: ['config.xml'], dest: 'build/sdk/' },
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
          { expand: true, cwd: '.', src: ['app/img/**'], dest: 'build/' }
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

    sdb: {
      prepare: {
        action: 'push',
        localFiles: './tools/grunt-tasks/tizen-app.sh',
        remoteDestDir: '/opt/home/developer/',
        chmod: '+x',
        overwrite: true
      },

      pushwgt: {
        action: 'push',
        localFiles: {
          pattern: 'build/*.wgt',
          filter: 'latest'
        },
        remoteDestDir: '/opt/home/developer/'
      },

      stop: {
        action: 'stop',
        remoteScript: '/opt/home/developer/tizen-app.sh'
      },

      uninstall: {
        action: 'uninstall',
        remoteScript: '/opt/home/developer/tizen-app.sh'
      },

      install: {
        action: 'install',
        remoteFiles: {
          pattern: '/opt/home/developer/*.wgt',
          filter: 'latest'
        },
        remoteScript: '/opt/home/developer/tizen-app.sh'
      },

      debug: {
        action: 'debug',
        remoteScript: '/opt/home/developer/tizen-app.sh',
        localPort: '8888',
        openBrowser: 'google-chrome %URL%'
      },

      start: {
        action: 'start',
        remoteScript: '/opt/home/developer/tizen-app.sh'
      }
    },

    simple_server: {
      port: 30303,
      dir: 'build/app/'
    }
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

  grunt.registerTask('sdk', [
    'clean',
    'copy:common',
    'imagemin:dist',
    'copy:sdk',
    'package:sdk'
  ]);

  grunt.registerTask('wgt', ['dist', 'copy:wgt', 'package:wgt']);
  grunt.registerTask('crx', ['dist', 'copy:crx']);

  grunt.registerTask('install', [
    'sdb:prepare',
    'sdb:pushwgt',
    'sdb:stop',
    'sdb:uninstall',
    'sdb:install',
    'sdb:start'
  ]);

  grunt.registerTask('wgt-install', ['wgt', 'install']);
  grunt.registerTask('sdk-install', ['sdk', 'install']);

  grunt.registerTask('restart', ['sdb:stop', 'sdb:start']);

  grunt.registerTask('server', ['dist', 'simple_server']);

  grunt.registerTask('default', 'wgt');
};
