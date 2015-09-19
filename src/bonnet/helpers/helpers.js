module.exports.register = function(Handlebars, options) {
  'use strict';

  Handlebars.registerHelper('replaceStr', function(haystack, needle, replacement) {
    if (haystack && needle)
      return haystack.replace(needle, replacement);
    return '';
  });

  Handlebars.registerHelper('createLink', function(path) {
    console.log("HERE", path)
    if (path)
      return path.replace('dist', '').replace('.html', '');
    return '';
  });
};