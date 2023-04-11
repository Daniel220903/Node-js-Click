const {format} = require('timeago.js');


const helpers = {};

helpers.timeago = (timestamp) => {
   return  format(timestamp);
};

const Handlebars = require('handlebars');

Handlebars.registerHelper('isEqual', function(a, b) {
  return a == b;
});

module.exports = Handlebars;


 module.exports = helpers;