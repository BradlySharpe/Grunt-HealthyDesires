module.exports = {
  clean: ['clean:localDev', 'sshexec:cleanRemoteDev'],
  build: ['assemble', 'concat', 'compass'],
  minify: ['copy', 'htmlmin', 'uglify', 'uncss'],
  optimise: [/*'move_pages', */'postcss', 'imagemin'],
  lint: ['jshint', 'csslint']
};
