var app = angular.module("projekt", ["ngMaterial", "ngCookies", "ngRoute", "pascalprecht.translate"]);


app.run(function($rootScope, $window, $location, $translate, $cookies){
    $rootScope.open = function(url){
        $window.location.href = url;
    }

    $rootScope.route = function(url){
        $location.path(url);
    }


});

app.controller("langCtrl", function($scope, $cookies, $translate){
    $scope.language = $cookies.get("lang") || "de_DE";

    $scope.$watch("language", function(newValue, oldValue){
        $translate.use($scope.language);
        $cookies.put("lang", $scope.language);
    });

    
});

app.config(function($mdThemingProvider, $routeProvider, $locationProvider, $translateProvider){


    // sendData("./public/src/lang/locale-en.json", function(result){
    sendData("/rest/lang/en", function(result){
        $translateProvider.translations('en_US', result);
    });

    sendData("rest/lang/de", function(result){
        $translateProvider.translations('de_DE', result);
    });
    
    $translateProvider.preferredLanguage(getCookie("lang"));


    $routeProvider
        .when("/", {
            templateUrl: "/public/views/main.html",
            controller: "navigationCtrl"
        })
        .when("/professoren", {
            templateUrl: "/public/views/professoren.html",
            controller: "profCtrl"
        })
        .when("/software", {
            templateUrl: "/public/views/professoren.html"
        })
        .when("/buch", {
            templateUrl: "/public/views/professoren.html"
        })
        .when("/dhbw", {
            templateUrl: "/public/views/dhbw.html"
        })
        .when("/freizeit", {
            templateUrl: "/public/views/professoren.html"
        })
        .when("/links", {
            templateUrl: "/public/views/links.html",
            controller: "linksCtrl"
        })
        .otherwise({
            redirectTo: "/"
        })

        $locationProvider.html5Mode(true);
      


    $mdThemingProvider.definePalette("myPalette", {
        "50": "e4f2fe",
        "100": "bce0fb",
        "200": "90cbf9",
        "300": "64b6f7",
        "400": "42a6f5",
        "500": "0072BC",/*prim*/
        "600": "1d8ef1",
        "700": "1883ef",
        "800": "1479ed",
        "900": "00a9e0",/*a*/
        "A100": "ffffff",
        "A200": "e1ecff",
        "A400": "aeccff",
        "A700": "95bcff",
        "contrastDefaultColor": "light",
        "contrastDarkColors": [
            "50",
            "100",
            "200",
            "300",
            "400",
            "A100",
            "A200",
            "A400",
            "A700"
        ],
        "contrastLightColors": [
            "500",
            "600",
            "700",
            "800",
            "900"
        ]
    });

    $mdThemingProvider.theme("default").primaryPalette("myPalette");

});


app.controller("navigationCtrl", function($scope){

    $scope.topics = [
        { display: "MENU_PROFS", link: "/professoren" },
        { display: "MENU_SOFTWARE", link: "/software" },
        { display: "MENU_BOOKS", link: "/buch" },
        { display: "MENU_FREETIME", link: "/freizeit" },
        { display: "DHBW", link: "/dhbw" },
        { display: "MENU_LINKS", link: "/links" }
    ];
});


app.controller("linksCtrl", function($scope){

    $scope.links = [
        { display: "Professoren", link: "/professoren" },
        { display: "Link Sammlung", link: "/links" }
    ];


});


app.controller("profCtrl", function($scope, $http){

    $http.get("/rest/profs").then(function(response){
        console.log(response);
        
        $scope.profs = response.data;
    });



});


app.controller("linksCtrl", function($scope, $http){

    $http.get("/rest/links").then(function(response){
        
        $scope.links = response.data;
    });



});


function sendData(url, callback) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
    } else {
      // code for older browsers
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        callback(JSON.parse(this.responseText));
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }

  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
