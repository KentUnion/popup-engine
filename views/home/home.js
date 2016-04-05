(function(angular) {
  "use strict";

  angular.module('popupEngine.home', ['firebase.auth', 'firebase', 'firebase.utils', 'ngRoute', 'ngMaterial', 'ngAnimate'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.whenAuthenticated('/', {
      templateUrl: 'views/home/home.html',
      controller: 'HomeCtrl as home',
      resolve: {
        user: ['Auth', function (Auth) {
          return Auth.$waitForAuth();
        }]
      }
    });
  }])

  .controller('HomeCtrl', ['fbutil', 'user', '$firebaseArray', 'FBURL', '$location', function HomeCtrl(fbutil, user, $firebaseArray, FBURL, $location) {

    var home = this;

    home.user = user;
    home.FBURL = FBURL;

    home.toggles = {
      running: true,
      scheduled: false,
      expired: false,
      createNew: false
    };

    // Date filtering
    home.currentTime = (new Date()).getTime();

    // Greater than date (scheduled popups)
    home.gtDate = function(prop, val) {
      return function(item){
        return item[prop] > val;
      };
    };

    // Range date (running popups)
    home.rDate = function(startProp, endProp, val) {
      return function(item){
        return (item[startProp] < val) && (val < item[endProp]);
      };
    };

    // Less than date (expired popups)
    home.ltDate = function(prop, val) {
        return function(item){
            return item[prop] < val;
        };
    };

    home.newPopup = {
       name: '',
       redirectLink: '',
       display: '',
       startTime: new Date(),
       endTime: new Date(),
       desktopImg: '',
       mobileImg: ''
    };

    // List
    // home.popups = $firebaseArray(fbutil.ref('surveys'));
    home.popups = $firebaseArray(fbutil.ref());

    // Add
    home.AddPopup = function() {
      home.newPopup.startTime = home.newPopup.startTime.getTime().toString();
      home.newPopup.endTime = home.newPopup.endTime.getTime().toString();

      home.popups.$add(home.newPopup).then(function(ref) {
        var id = ref.key();
        var posArray = home.popups.$indexFor(id);

        home.popups[posArray].id = id;
        home.popups.$save(posArray).then(function(ref) {
          console.log("Saved new popup!");

          home.newPopup = {
            name: '',
            redirectLink: '',
            display: '',
            startTime: new Date(),
            endTime: new Date(),
            desktopImg: '',
            mobileImg: ''
          };
        });
      });
    };

    // Delete
    home.DeletePopup = function(id) {
      var posArray = home.popups.$indexFor(id);
      home.popups.$remove(home.popups[posArray]).then(function() {
        console.log("Deleted popup!");
      });
    };

    home.EditPopup = function(id) {
       $location.path('/edit/').search({popupid: id});
    };

  }]);

})(angular);
