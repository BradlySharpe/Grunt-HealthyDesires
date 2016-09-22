module.exports = {
  includes: {
    files: [
      {
        expand: true,
        cwd: '<%= config.src %>/content/includes/contact',
        src: ['**'],
        dest: '<%= config.dest %>/contact/'
      }
    ]
  }
};
