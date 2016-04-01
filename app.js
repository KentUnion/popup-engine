'use strict';

angular.module('popupEngine', [
	'popupEngine.config',
	'popupEngine.security',
	'popupEngine.home',
	'popupEngine.login',
	'popupEngine.edit',
	'popupEngine.anim',
	'ngMaterial',
	'ngAnimate'
])

.config(['$routeProvider', '$mdThemingProvider', function ($routeProvider, $mdThemingProvider) {
  $routeProvider.otherwise({
    redirectTo: '/'
  });

}])

.run(['$rootScope', 'Auth', function($rootScope, Auth) {
	Auth.$onAuth(function(user) {
		$rootScope.loggedIn = !user;
	});

	$rootScope.errors = [];
	$rootScope.success = [];
}]);
