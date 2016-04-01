(function(angular) {
  "use strict";

  angular.module('popupEngine.edit', ['firebase.auth', 'firebase', 'firebase.utils', 'ngRoute', 'ngMaterial'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.whenAuthenticated('/edit', {
      templateUrl: 'views/edit/edit.html',
      controller: 'EditCtrl as edit',
      resolve: {
        user: ['Auth', function (Auth) {
          return Auth.$waitForAuth();
        }]
      }
    });
  }])

  .controller('EditCtrl', ['$scope', 'fbutil', 'user', '$firebaseObject', '$firebaseArray', 'FBURL', '$routeParams', '$location', function EditCtrl($scope, fbutil, user, $firebaseObject, $firebaseArray,FBURL, $routeParams, $location) {
    var id = $routeParams.popupid;
    var edit = this;

    edit.user = user;
    edit.FBURL = FBURL;

    var popup = $firebaseObject(fbutil.ref(id));
    
    edit.popup = popup;
    
    popup.$loaded().then(function(ref) {
      edit.expDate = new Date(parseInt(edit.popup.endTime));
      edit.strDate = new Date(parseInt(edit.popup.startTime));
    });
    
    // Update Popup
    edit.UpdatePopup = function() {
      edit.popup.endTime = edit.expDate.getTime();
      edit.popup.startTime = edit.strDate.getTime();
      
      edit.popup.$save().then(function(ref) {
        console.log('Popup saved!');
        $location.path('/');
      });
    };
    
  }]);

})(angular);