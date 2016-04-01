(function(angular) {

"use strict";
angular.module('popupEngine.login', ['firebase.utils', 'firebase.auth', 'ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/login', {
      controller: 'LoginCtrl as login',
      templateUrl: 'views/login/login.html'
    });
  }])

  .controller('LoginCtrl', ['Auth', '$location', 'fbutil', function LoginCtrl(Auth, $location, fbutil) {
    var login = this;

    login.email = null;
    login.pass = null;

    login.login = function(email, pass) {
      login.err = null;
      Auth.$authWithPassword({ email: email, password: pass }, {rememberMe: true})
        .then(function(/* user */) {
          $location.path('/');
        }, function(err) {
          login.err = err.code;
        });
    };

  }]);
})(angular);