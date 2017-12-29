angular.module('app.routes', ['ui.router'])
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/')
    $stateProvider
      .state('home', {
        url: '/',
        views: {
          'main': {
            templateUrl: 'views/home.html'
          },
        }
      })



      .state('upload', {
        url: '/upload',
        views: {
          'main': {
            templateUrl: 'views/upload.html'
          }
        }
      })

      .state('image', {
        url: '/image/{imageId}',
        views: {
          'main': {
            templateUrl: 'views/image.html'
          }
        }
      })

      .state('taggedImage', {

        url: '/tagged/{tag}',
        views: {
          'main': {
            templateUrl: 'views/taggedImage.html'
          }
        }
      });

  });
