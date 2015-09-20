/*
  git:
    GitPush without credentials
      git config remote.origin.url https://brad7928:{PASSWORD}@github.com/brad7928/{REPO}.git
    Remove origin/HEAD -> origin/master branch
      git remote set-head origin -d
 */

(function() {
  'use strict';

  module.exports = function(grunt) {

    var globalConfig = {
      src: './src/',
      dest: './dist/',
      tasks: {
        html: ['assemble', 'htmlmin', 'movePages'],
        javascript: {
          force: ['concat', 'uglify', 'jshint'],
          newer: ['newer:concat', 'newer:uglify', 'jshint']
        },
        css: {
          force: ['compass', 'cmq', 'uncss', 'postcss', 'csslint'],
          newer: ['newer:compass', 'newer:cmq', 'newer:uncss', 'postcss', 'csslint']
        },
        image: {
            force: ['imagemin'],
            newer: ['newer:imagemin'],
        },
        all: {}
      },
      pagespeed: {
        url: 'http://test.healthydesires.com.au',
        locale: "en_GB",
        threshold: {
          desktop: 90,
          mobile: 90
        },
        pages: ['/']
      }
    };

    globalConfig.tasks.all.force = (function() {
      var tasks = globalConfig.tasks;
      return [].concat(tasks.html, tasks.javascript.force, tasks.css.force, tasks.image.force);
    })();

    globalConfig.tasks.all.forceClean = (function() {
      var tasks = globalConfig.tasks;
      return ['clean:localDev'].concat(tasks.html, tasks.javascript.force, tasks.css.force, tasks.image.force);
    })();

    globalConfig.tasks.all.newer = (function() {
      var tasks = globalConfig.tasks;
      return [].concat(tasks.html, tasks.javascript.newer, tasks.css.newer, tasks.image.newer);
    })();

    globalConfig.tasks.default = (function() {
      return globalConfig.tasks.all.newer.concat(['connect', 'watch']);
    })();

    globalConfig.tasks.deploy = (function() {
      return ['clean:localDev'].concat(globalConfig.tasks.all.force.concat(['sshexec:cleanRemoteDev', 'sftp', 'pagespeed']));
    })();

    grunt.initConfig({
      pkg: grunt.file.readJSON('./package.json'),
      credentials: grunt.file.readJSON('./credentials.json'),
      globalConfig: globalConfig,

      // Run Server
      connect: {
        dev: {
          options: {
            livereload: true,
            port: 3000,
            base: '<%= globalConfig.dest %>'
          }
        }
      },

      // Clean
      clean: {
        options: {
          force: true,
          "no-write": false
        },
        localDev: ['<%= globalConfig.dest %>**/*']
      },

      // Assemble
      assemble: {
        options: {
          collections: [
            {
              name: 'post',
              sortby: 'posted',
              sortorder: 'descending'
            },
            {
              name: 'shop',
              sortby: 'title',
              sortorder: 'ascending'
            },
            {
              name: 'catering',
              sortby: 'title',
              sortorder: 'ascending'
            }
          ],
          helpers: '<%= globalConfig.src %>bonnet/helpers/**/*.js',
          layout: 'page.hbs',
          layoutdir: '<%= globalConfig.src %>bonnet/layouts/',
          partials: '<%= globalConfig.src %>bonnet/partials/**/*.hbs'
        },
        posts: {
          files: [
            {
              cwd: '<%= globalConfig.src %>content/',
              dest: '<%= globalConfig.dest %>',
              expand: true,
              src: ['**/*.hbs', '**/*.md', '!_pages/**/*.hbs']
            },
            {
              cwd: '<%= globalConfig.src %>content/_pages/',
              dest: '<%= globalConfig.dest %>',
              expand: true,
              src: '**/*.hbs'
            }
          ]
        }
      },

      // Concat JavaScripts
      concat: {
        dev: {
          src: '<%= globalConfig.src %>bonnet/scripts/**/*.js',
          dest: '<%= globalConfig.dest %>js/<%= pkg.name %>.js'
        }
      },

      // Minify Combined JavaScripts
      uglify: {
        dev: {
          options: {
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */'
          },
          files: {
            '<%= globalConfig.dest %>js/<%= pkg.name %>.min.js': [ '<%= globalConfig.dest %>js/<%= pkg.name %>.js' ]
          }
        }
      },

      // Lint JavaScripts
      jshint: {
        options: {
          globals: {
            jQuery: true,
            console: true,
            module: true
          }
        },
        configuration: ['Gruntfile.js'],
        scripts: ['<%= globalConfig.src %>bonnet/script/**/*.js'],
        compiled: ['<%= globalConfig.dest %>js/**/*.js', '!<%= globalConfig.dest %>js/**/*.min.js']
      },

      // Compile SASS files
      compass: {
        dev: {
          options: {
            sassDir: '<%= globalConfig.src %>bonnet/sass/',
            cssDir: '<%= globalConfig.dest %>css/'
          }
        }
      },

      // Combine Media Queries
      cmq: {
        options: {
          log: true
        },
        dev: {
          files: [
            {
              expand: true,
              cwd: '<%= globalConfig.dest %>css/',
              src: ['*.css', '!*.min.css'],
              dest: '<%= globalConfig.dest %>css/'
            }
          ]
        }
      },

      // Remove unused CSS
      uncss: {
        dev: {
          options: {
            ignore: [], // Selectors to ignore
            stylesheets: ['../../css/stylesheet.css'], // Stylesheets to read
            report: 'min' // Reporting
          },
          cwd: './',
          src: '<%= globalConfig.dest %>**/*.html',
          dest: '<%= globalConfig.dest %>css/stylesheet.css'
        }
      },

      // PostCSS
      //  - Add Pixel fallbacks for REM units (pixrem)
      //  - Add prefix for browsers eg: -webkit-, -moz- (autoprefixer)
      //  - Minify CSS (cssnano)
      postcss: {
        options: {
          map: {
            inline: false, // Save source maps in separate files
            annotation: '<%= globalConfig.dest %>css/maps/' // Where to save maps
          },
          processors: [
            require('pixrem')(),
            require('autoprefixer')({
              browsers: [ 'last 2 versions', 'ie > 7', '> 1%']
            }),
            require('cssnano')()
          ]
        },
        dev: {
          files : [
            {
              expand: true,
              cwd: '<%= globalConfig.dest %>css',
              src: ['**/*.css', '!**/*.min.css'],
              dest: '<%= globalConfig.dest %>css',
              ext: '.min.css'
            }
          ]
        }
      },

      // Lint CSS files
      csslint: {
        strict: {
          options: {
            import: 2
          },
          src: ['<%= globalConfig.dest %>css/**/*.css']
        }
      },

      // Minify HTML files
      htmlmin: {
        dev: {
          options: {
            removeComments: true,
            collapseWhitespace: true
          },
          files: [
            {
              expand: true,
              cwd: '<%= globalConfig.dest %>',
              src: ['**/*.html', '!css/**/*', '!js/**/*', '!images/**/*'],
              dest: '<%= globalConfig.dest %>'
            }
          ]
        }
      },

      // Move Pages
      movePages: {
        options: {
          verbose: true,
          overwrite: true
        },
        dev: {
          files:  [
            {
              expand: true,
              cwd: '<%= globalConfig.dest %>',
              src: ['**/*.html', '!**/*index.html'],
              dest: '<%= globalConfig.dest %>'
            }
          ]
        }
      },

      // Create Sitemap
      //  - Currently has bug, doesn't remove CWD from location
      //    https://github.com/furzeface/grunt-xml-sitemap/issues/7
      //
      //  Fix: tasks/xml_sitemap.js#L56
      //
      //  // remove CWD from filename
      //  var dest = options.dest;
      //  if (dest.indexOf('./') === 0)
      //    dest = dest.slice(2)
      //  if (file.indexOf(dest) === 0)
      //      file = file.slice(dest.length);

      xml_sitemap: {
        options: {
          dest: '<%= globalConfig.dest %>',
          siteRoot: '<%= pkg.protocol %>://<%= pkg.domain %>/'
        },
        dev: {
          files: [
            {
              expand: true,
              cwd: '<%= globalConfig.dest %>',
              dest: '<%= globalConfig.dest %>',
              src: ['**/*.html']
            }
          ]
        }
      },

      // Optimise Image files
      imagemin: {
        dev: {
          options: {
            optimizationLevel: 5
          },
          files: [
            {
              expand: true,
              cwd: '<%= globalConfig.src %>images',
              src: ['**/*.{png,jpg,jpeg,gif,svg}'],
              dest: '<%= globalConfig.dest %>images'
            }
          ]
        }
      },

      // Clean Remote Files
      sshexec: {
        cleanRemoteDev: {
          command: "cd <%= credentials.sftp.dev.directory %><%= pkg.domain %>/ && rm -rf *",
          options: {
            host: "<%= credentials.sftp.dev.host %>",
            username: "<%= credentials.sftp.dev.username %>",
            password: "<%= credentials.sftp.dev.password %>"
          }
        }
      },

      // SFTP Files to Server
      sftp: {
        dev: {
          files: {
            "./": "<%= globalConfig.dest %>**"
          },
          options: {
            path: "<%= credentials.sftp.dev.directory %><%= pkg.domain %>/",
            host: "<%= credentials.sftp.dev.host %>",
            username: "<%= credentials.sftp.dev.username %>",
            password: "<%= credentials.sftp.dev.password %>",
            srcBasePath: "<%= globalConfig.dest %>",
            showProgress: true,
            createDirectories: true
          }
        }
      },

      // PageSpeed Test
      pagespeed: {
        options: {
          nokey: true,
          locale: globalConfig.pagespeed.locale,
          url: globalConfig.pagespeed.url
        },
        desktop: {
          options: {
            url: globalConfig.pagespeed.url,
            strategy: "desktop",
            threshold: globalConfig.pagespeed.threshold.desktop,
            paths: globalConfig.pagespeed.pages
          }
        },
        mobile: {
          options: {
            url: globalConfig.pagespeed.url,
            strategy: "mobile",
            threshold: globalConfig.pagespeed.threshold.mobile,
            paths: globalConfig.pagespeed.pages
          }
        }
      },

      watch: {
        options: {
          livereload: true,
          livereloadOnError: false,
          interrupt: false
        },
        dev: {
          files: ['Gruntfile.js', 'credentials.json', 'package.json', '<%= globalConfig.src %>bonnet/helpers/**/*.js'],
          tasks: globalConfig.tasks.all.force
        },
        html: {
          files: ['<%= globalConfig.src %>**/*.hbs'],
          tasks: globalConfig.tasks.html
        },
        css: {
          files: ['<%= globalConfig.src %>bonnet/sass/**/*.{sass,scss}', '<%= globalConfig.dest %>**/*.html'],
          tasks: globalConfig.tasks.css.force
        },
        javascript: {
          files: ['<%= globalConfig.src %>bonnet/scripts/**/*.js'],
          tasks: globalConfig.tasks.javascript.force
        },
        images: {
          files: ['<%= globalConfig.src %>images/**/*.{png,jpg,jpeg,gif,svg}'],
          tasks: globalConfig.tasks.image.newer
        }
      }
    });

    // Include packages
    require('time-grunt')(grunt);
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.loadNpmTasks('assemble');

    // Create movePages Task
    grunt.registerMultiTask('movePages', 'Move top level pages into subfolders', function() {
      var done = this.async(),
        path = require('path'),
        count = 0,
        opt = this.options();
      opt.verbose = opt.verbose || false;
      opt.overwrite = opt.overwrite || false;

      this.files.forEach(function(file){
        var dest = "" + file.src;
        dest = (dest.slice(0, -path.extname(dest).length) + '/index.html').toLowerCase();
        if (opt.verbose)
          grunt.log.writeln("Moving " + file.src + ' to ' + dest);
        if (!grunt.file.exists(dest) || opt.overwrite) {
          grunt.file.copy(file.src, dest);
          grunt.file.delete(file.src);
          count++;
        } else {
          grunt.log.error("Destination already exists: " + dest + ", source: " + file.src);
          done(false);
        }
      });

      grunt.log.writeln("Moved " + count.toString() + " file" + ((1 == count)? "" : "s"));
      done(true);
    });

    // Register Tasks
    grunt.registerTask('default', globalConfig.tasks.default);
    grunt.registerTask('html', globalConfig.tasks.html);
    grunt.registerTask('javascript', globalConfig.tasks.javascript.newer);
    grunt.registerTask('css', globalConfig.tasks.css.newer);
    grunt.registerTask('image', globalConfig.tasks.image.newer);
    grunt.registerTask('javascript-force', globalConfig.tasks.javascript.force);
    grunt.registerTask('css-force', globalConfig.tasks.css.force);
    grunt.registerTask('image-force', globalConfig.tasks.image.force);
    grunt.registerTask('all', globalConfig.tasks.all.newer);
    grunt.registerTask('force', globalConfig.tasks.all.force);
    grunt.registerTask('forceClean', globalConfig.tasks.all.forceClean);
    grunt.registerTask('deploy', globalConfig.tasks.deploy);
  };
}());
