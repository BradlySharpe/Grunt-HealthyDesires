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
    var path = require('path');

    var config = {
      src: './src/',
      dest: './dist/',
      pagespeed: {
        locale: "en_GB",
        threshold: {
          desktop: 90,
          mobile: 70
        },
        pages: ['/']
      }
    };

    grunt.initConfig({
      destination: config.dest // Needed for UnCSS
    });

    // Include packages
    require('time-grunt')(grunt);

    require('load-grunt-config')(grunt, {
      // Set Config Path
      configPath: path.join(process.cwd(), 'grunt/config'),
      // Pass options to grunt-jit
      jitGrunt: {
        customTasksDir: 'grunt/tasks',
        staticMappings: {
          cmq: 'grunt-combine-media-queries',
          sshexec: 'grunt-ssh',
          sftp: 'grunt-ssh',
          htmllint: 'grunt-html',
        }
      },
      // All keys available using <%= key.property %>
      data: {
        foo: 'bar',  // accessible with '<%= foo %>'
        config: config,
        pkg: grunt.file.readJSON('./package.json'),
        credentials: grunt.file.readJSON('./credentials.json')
      }
    });
  };
}());
