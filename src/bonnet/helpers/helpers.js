module.exports.register = function(Handlebars, options) {
  'use strict';

  Handlebars.registerHelper('replaceStr', function(haystack, needle, replacement) {
    if (haystack && needle)
      return haystack.replace(needle, replacement);
    return '';
  });

  Handlebars.registerHelper('createLink', function(path) {
    var folder = options.config.dest.replace('.', '').replace('/', '');
    if (path)
      return '/' + path.replace(folder, '').replace(/index\.html$/, '');
    return '';
  });

  Handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context);
  });
};
