module.exports = {
  options: {
    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */'
  },
  dev: {
    files: {
      '<%= config.dest %>js/<%= pkg.name %>.min.js': [ '<%= config.dest %>js/<%= pkg.name %>.js' ]
    }
  },
  contact: {
    files: {
      '<%= config.dest %>js/contact.min.js': [ '<%= config.dest %>js/contact.js' ]
    }
  }
};
