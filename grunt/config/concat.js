module.exports = {
  dev: {
    src: ['<%= config.src %>bonnet/scripts/**/*.js', '!<%= config.src %>bonnet/scripts/contact/**/*.js'],
    dest: '<%= config.dest %>js/<%= pkg.name %>.js'
  },
  contact: {
    src: ['<%= config.src %>bonnet/scripts/contact/**/*.js'],
    dest: '<%= config.dest %>js/contact.js'
  }
};
