var normalizedPath = require("path").join(__dirname, './js/angular'),
    files = [
        '/controllers/mainController.js',
        '/controllers/tab1Controller.js',
        // '/controllers/tab2Controller.js',
        // '/controllers/tab3Controller.js',
        // '/controllers/tab4Controller.js',
        // '/controllers/component1Controller.js'
    ];

// load the cached templates
// before everything else.
require(normalizedPath + '/templates.js');

// setup the angular app module
const app = angular.module('BoilerPlate', ['templates', 'ui.router']);

// setup routing
app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/main');

    $stateProvider
        .state('main', {
            url: '/main',
            views: {
                '': {
                    templateUrl: './templates/main.html',
                    controller: 'MainController',
                },
                'nav': navView,
                'component1@main': {
                    templateUrl: './templates/component1.html',
                    // controller: 'Component1Controller'
                }
            }
        })
        .state('tab1', {
            url: '/tab1',
            views: {
                '': {
                    templateUrl: './templates/tab1.html',
                    controller: 'Tab1Controller'
                },
                'nav': navView
            }
        })
        .state('tab2', {
            url: '/tab2',
            views: {
                '': {
                    templateUrl: './templates/tab2.html',
                    // controller: 'Tab2Controller'
                },
                'nav': navView
            }
        })
        .state('tab3', {
            url: '/tab3',
            views: {
                '': {
                    templateUrl: './templates/tab3.html',
                    // controller: 'Tab3Controller'
                },
                'nav': navView
            }
        })
        .state('tab4', {
            url: '/tab4',
            views: {
                '': {
                    templateUrl: './templates/tab4.html',
                    // controller: 'Tab4Controller'
                },
                'nav': navView
            }
        })
})

var navView = {
    templateUrl: './templates/nav.html'
}

// loop through all the files
// and require them
for (var i = 0, length = files.length; i < length; i++) {
    require(normalizedPath + files[i]);
}