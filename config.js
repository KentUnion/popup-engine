'use strict';

// Declare app level module which depends on filters, and services
angular.module('popupEngine.config', [])
	
	.constant('FBURL', 'https://kupopups.firebaseio.com/')

	// where to redirect users if they need to authenticate (see security.js)
	.constant('loginRedirectPath', '/login');
