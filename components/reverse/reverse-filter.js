'use strict';

/* Filters */

angular.module('popupEngine')
  .filter('reverse', function() {
    return function(items) {
      return items.slice().reverse();
    };
  });