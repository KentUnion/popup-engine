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

    // TODO filter scheduled popups out

    // filter expired popups out
    home.currentTime = (new Date()).getTime();
    home.gtDate = function(prop, val) {
      return function(item){
        return item[prop] > val;
      };
    };

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

    // // Add Answer
    // home.AddAnswer = function(answer) {
    //   if( answer ) {
    //     home.newSurvey.answers.push({text: answer});
    //   }

    //   home.newAnswer = null;
    // };

    // // TODO: Delete Answer!
    // home.RemoveAnswer = function(answer) {
    //   var index = home.newSurvey.answers.indexOf(answer);
    //   if (index > -1) {
    //     home.newSurvey.answers.splice(index, 1);
    //     console.log('Removed Successfully!');
    //   }
    // };

    // // Brands
    // home.newBrand = {
    //   name: '',
    //   image: ''
    // };
    // home.currentBrand = '';

    // home.brands = $firebaseArray(fbutil.ref('brands'));
    // home.AddBrand = function() {
    //   home.brands.$add(home.newBrand).then(function(ref) {
    //     home.newBrand = {
    //       name: '',
    //       image: ''
    //     };
    //   });
    // };
    // home.SaveBrand = function() {
    //   home.brands[home.currentBrand].name = home.newBrand.name;
    //   home.brands[home.currentBrand].image = home.newBrand.image;

    //   home.brands.$save(home.currentBrand).then(function(ref) {
    //     home.currentBrand = '';
    //     home.isBrandEdit = false;
    //     home.newBrand = {
    //       name: '',
    //       image: ''
    //     };
    //   });
    // };
    // home.EditBrand = function(id) {
    //   var posArray = home.brands.$indexFor(id);
    //   home.currentBrand = posArray;
    //   home.isBrandEdit = true;
    //   home.newBrand = {
    //     name: home.brands[posArray].name,
    //     image: home.brands[posArray].image
    //   };
    // };
    // home.DeleteBrand = function(id) {
    //   var posArray = home.brands.$indexFor(id);
    //   home.brands.$remove(posArray).then(function() {
    //     console.log("Removed brand!");
    //   });
    // };

    // List
    // home.popups = $firebaseArray(fbutil.ref('surveys'));
    home.popups = $firebaseArray;

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

    home.EditPopups = function(id) {
       $location.path('/edit/').search({popupid: id});
    };

  }]);

})(angular);
