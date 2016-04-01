(function() {
  $(document).ready(function() {
      // Check Display status
      // --- "instantly" - 0
      // --- "smallDelay" - 0 to 5 seconds
      // --- "analyticsDelay" - 0, avgTimeOnPage seconds
      var displayTime;
      var avgTimeOnPage = 3 * 60 + 18; //avg Time on Page by Google Analytics
      var randCounter;

      FilterPopups(FB()).then( function(arr) {
        var popup = arr[0];

        if (typeof popup !== 'undefined') {
          switch(popup.display) {
            case 'instantly':
              displayTime = 0;
              break;
            case 'smallDelay':
              displayTime = 5;
              break;
            case 'analyticsDelay':
              displayTime = avgTimeOnPage;
              break;
            default:
              displayTime = avgTimeOnPage;
              break;
          }
          randCounter = getRandomIntInclusive(0, displayTime * 1000);

          setTimeout(function() {
            $('#_CONTENT_COLUMN').append(RenderPopup(popup));
            setTimeout(function() {
              $('#_CONTENT_COLUMN').find('#popup_container').addClass('animatePopupIn');
            }, 0);

            BindEvents(popup);
          }, randCounter);
        }
        else
          console.log("No popup to show!");
      });
  });

  /**
  * Connects to the firebase instance and returns ref
  */
  function FB() {
    return new Firebase('https://kupopups.firebaseio.com/');
  }
  /**
  * Return reference to provided firebase path
  */
  function fbpath(path) {
    if( path !== '' ) {
      return FB().child(path);
    } else
      console.error('Path was blank!');
  }
  /**
  * Makes sure only the surveys that are still running are used
  * return promise
  */
  function FilterPopups(ref) {
    var deferred = $.Deferred(),
      counter = 0,
      available = [],
      today = new Date().getTime();

    ref.once('value', function(popups) {
      var maxChildren = popups.numChildren();
      popups.forEach(function(popup) {
        counter++;
        if( !CheckCookie(popup.val()) ) {
          //compare unix timestamps
          if( popup.val().startTime < today && popup.val().endTime > today ) { // ENABLE ON PROD
          // if( popup.val().endTime > today ) { // DISABLE ON PROD
            available.push(popup.val());
          }
        }

        if( counter === maxChildren ) {
          deferred.resolve(available);
        }
      });
    });

    return deferred.promise();
  }
  /**
  * Check if user has a cookie set for the current tiny survey
  * returns bool
  */
  function CheckCookie(popup) {
    var currentPopup = GetCookie("p_" + popup.id);
    if (currentPopup !== "" && currentPopup !== "notShow") {
      return false;
    } else {
      return currentPopup;
    }
  }

  function GetCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0)===' ') c = c.substring(1);
      if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
    }
    return "";
  }

  /**
  * Set cookie with current tinySurvey
  * expires one day after the endTime
  */
  function SetCookie(popup) {
    var d = new Date( parseInt(popup.endTime) + (1 * 24 * 60 * 60 * 1000) );
    var expires = "expires=" + d;
    document.cookie = "p_" + popup.id + "=notShow" + "; " + expires + ";domain=.kentunion.co.uk;path=/";
  }

  /**
  * Renders the current popup
  * returns HTML
  */
  function RenderPopup(popup) {
    var html = '<div id="popup_container"><div>';
    html += '<div class="popup_overlay"></div>';
    html += '<div class="popup_content">';
    html += '<div class="closeBtn"><div class="icon"></div></div>';
    if($(window).width() < 768) {
      html += '<a href="' + popup.redirectLink + '"><img src="' + popup.mobileImg + '" class="materializeImg" data-desktop="' + popup.desktopImg + '" data-mobile="' + popup.mobileImg + '"></a>';
    } else {
      html += '<a href="' + popup.redirectLink + '"><img src="' + popup.desktopImg + '" class="materializeImg" data-desktop="' + popup.desktopImg + '" data-mobile="' + popup.mobileImg + '"></a>';
    }
    html += '<img src="' + popup.mobileImg + '" class="hidden"><img src="' + popup.desktopImg + '" class="hidden">';
    html += '</div>';
    html += '</div></div>';

    return html;
  }

  /**
	* Bind Events on rendered survey
	*/
	function BindEvents(popup) {
    $('#popup_container').find('.popup_overlay').on('click', function() {
      slidePopupOut(300);
    });

    $('#popup_container').find('.closeBtn').on('click', function() {
      slidePopupOut(300);
      SetCookie(popup);
    });

    $(window).smartresize(function() {
      var e = $('#popup_container').find('a > img');
      var eD = e.attr('data-desktop');
      var eM = e.attr('data-mobile');

      if($(window).width() < 768) {
        e.attr('src', eM);
      } else {
        e.attr('src', eD);
      }
    });
	}

  // Returns a random integer between min (included) and max (included)
  // Using Math.round() will give you a non-uniform distribution!
  function getRandomIntInclusive(min, max) {
    var r = Math.floor(Math.random() * (max - min + 1)) + min;
    console.info('Displaying Popup in: ' + r / 1000 + ' seconds');
    return r;
  }

  function slidePopupOut(animationSpeed) {
    var c = $('#popup_container');
    c.removeClass('animatePopupIn');
    setTimeout( function() {
      c.remove();
    }, animationSpeed);
  }
})();
