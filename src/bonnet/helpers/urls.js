/* jshint esversion: 6 */
module.exports.register = function(Handlebars, options) {
  'use strict';

  function getURL(destination) {
    var folder = options.config.dest.replace('.', '').replace('/', ''),
      regexDestination = new RegExp(`^${folder}`, 'i'),
      regexIndex = /index\.html$/i;
    destination = destination.replace(regexDestination, '');
    destination = destination.replace(regexIndex, '');
    return `/${destination}`;
  }

  function getFullURL(destination) {
    var url = getURL(destination);
    if (url) return getDomain() + url;
    return;
  }

  function getDomain() {
    return `${options.pkg.protocol}://${options.pkg.domain}`;
  }

  Handlebars.registerHelper('getBaseURL', function(destination) {
    return new Handlebars.SafeString(getDomain());
  });

  Handlebars.registerHelper('getURL', function(destination) {
    return new Handlebars.SafeString(getURL(destination));
  });

  Handlebars.registerHelper('getFullURL', function(destination) {
    return new Handlebars.SafeString(getFullURL(destination));
  });

  Handlebars.registerHelper('getURLEncoded', function(destination) {
    return new Handlebars.SafeString(encodeURIComponent(getURL(destination)));
  });

  Handlebars.registerHelper('getFullURLEncoded', function(destination) {
    return new Handlebars.SafeString(encodeURIComponent(getFullURL(destination)));
  });

  Handlebars.registerHelper('getDomain', function(destination) {
    return new Handlebars.SafeString(getDomain());
  });

  Handlebars.registerHelper('getDomainEncoded', function(destination) {
    return new Handlebars.SafeString(encodeURIComponent(getDomain()));
  });
};
