var app = require("../app");

var isEmptyObject = function(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
};

var exports = module.exports = {
	isEmptyObject: isEmptyObject
};