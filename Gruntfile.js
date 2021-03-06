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
      },
      google: {
        recaptcha: {
          key: "6Lct0QYUAAAAAB6ZiDxN60RS7A30nD5POOhMheKy",
          secret: "6Lct0QYUAAAAANp9SPHDt273lr1h7Sa8Z2Vf_jqJ"
        }
      },
      instagram: {
        "username": "healthydesires1",
        "user-id": "1791541740",
        "client-id": "e117137e514442b4808c8bafbedf409a",
        "access-token": "1791541740.e117137.b337a45f7eda4b5d86d714856853c2ec",
        //"template": "<a href='{{link}}'><img src='{{image}}' /></a>"
        "template": '<img class="gallery-image" src="{{image}}" data-jslghtbx="{{model.images.standard_resolution.url}}" />'
      }
      // Generate new Token
      //https://www.instagram.com/oauth/authorize/?client_id=e117137e514442b4808c8bafbedf409a&redirect_uri=http://test.healthydesires.com.au/gallery&response_type=token&scope=likes+comments+relationships+basic
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
