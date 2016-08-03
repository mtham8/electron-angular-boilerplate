var normalizedPath = require("path").join(__dirname, './scripts'),
    files = [
        '/controllers/mainController.js',
        '/controllers/tab1Controller.js',
        '/controllers/tab2Controller.js',
        '/controllers/tab3Controller.js',
        '/controllers/tab4Controller.js',
        '/controllers/component1Controller.js'
    ];

// load the cached templates
// before everything else.
require(normalizedPath + '/templates.js');

// setup the angular app module
const app = angular.module('app', ['ui.mask', 'localytics.directives', 'templates', 'ui.router', 'electangular']);

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
        .state('tab5', {
            url: '/tab5',
            views: {
                '': {
                    templateUrl: './templates/tab5.html',
                    // controller: 'Tab5Controller'
                },
                'nav': navView
            }
        })
        .state('tab6', {
            url: '/tab6',
            views: {
                '': {
                    templateUrl: './templates/tab6.html',
                    // controller: 'Tab6Controller'
                },
                'nav': navView
            }
        })
        .state('tab7', {
            url: '/tab7',
            views: {
                '': {
                    templateUrl: './templates/tab7.html',
                    // controller: 'Tab7Controller'
                },
                'nav': navView
            }
        })
        .state('tab8', {
            url: '/tab8',
            views: {
                '': {
                    templateUrl: './templates/tab8.html',
                    // controller: 'Tab8Controller'
                },
                'nav': navView
            }
        })
})

var navView = {
    templateUrl: './templates/nav.html'
}

// setup config that can be used in
// controllers, directives, services, and factories
app.constant('config', {
    leadgen_remote_server: 'http://lg3.gpjconnect.com',
    contentful_space: 'fl733vlxyp2b',
    contentful_accessToken: '4f928dad11d95e949eba27329225ddaa754c581c9adb1da93c8a530b30abf757',
    home_path: require("path").join(__dirname, '/')
});

// loop through all the files
// and require them
for (var i = 0, length = files.length; i < length; i++) {
    require(normalizedPath + files[i]);
}

$(function() {
    $('body').removeClass('js-not-ready');
});