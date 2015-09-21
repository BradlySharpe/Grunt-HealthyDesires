module.exports = function(grunt) {
  // Create movePages Task
  grunt.registerMultiTask('move_pages', 'Move top level pages into subfolders', function() {
    var done = this.async(),
      path = require('path'),
      count = 0,
      opt = this.options({
        verbose: false,
        overwrite: false
      });

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
};
