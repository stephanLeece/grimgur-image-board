angular.module('myApp', ['app.routes', 'app.nav'])

.run(function($rootScope, $state, $stateParams){
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
  $rootScope.$on('$stateChangeSuccess', function() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  });
})

  .controller('mainCtrl', function($scope, $http) {
    $scope.getImages = function(aValue) {
      if (aValue) {
        console.log('refreshing popular list');
        $http.get('/popular').then(function(resp) {
          $scope.images = resp.data;
        });
      } else {
        console.log('refreshing  list');
        $http.get('/images').then(function(resp) {
          $scope.images = resp.data;
        });
      }
      //

    };
    $scope.showMore = function() {
      console.log('clicked');
      $scope.displayLimit += 8;
    };
    $http.get('/images').then(function(resp) {
      $scope.images = resp.data;
    });
  })




  .controller('formCtrl', function($scope, $http, $location) {
    $scope.err = ''
    $scope.file = '{}';
    $scope.submit = function() {
      if (!$scope.user || !$scope.title) {
        $scope.err = 'Please complete required fields'
      } else {
        console.log('running submit');
        var file = $('input[type="file"]').get(0).files[0];
        var user = $scope.user;
        var title = $scope.title;
        var descrip = $scope.descrip;
        var payload = new FormData();
        payload.append('file', file);
        payload.append('user', user);
        payload.append("title", title);
        payload.append("descrip", descrip);
        console.log(typeof $scope.tags, $scope.tags);
        if ($scope.tags) {
          var tags = $scope.tags;
          payload.append("tags", tags)
        }
        $http({
          url: '/upload',
          method: 'POST',
          data: payload,
          headers: {
            'Content-Type': undefined
          },
          transformRequest: angular.identity
        }).catch(function(err) {
          $scope.err = 'That image is too big...'
        });
        $scope.err = 'Success!!'
      };
    };
  })



  .controller('imageCtrl', function($scope, $http, $location) {
    $scope.showMore = function() {
      console.log('clicked');
      $scope.displayLimit += 5;
    }


    var imgUrl = '/image/' + $location.path().split('/').pop();
    console.log(imgUrl);
    $http.get(imgUrl).then(function(resp) {
      console.log(resp.data);
      $scope.imageWComment = resp.data;
    });

    $scope.err = ''
    $scope.submit = function() {

      if (!$scope.username || !$scope.comment) {
        $scope.err = 'Please complete required fields'
      } else {
        console.log('submittin dis');
        var username = $scope.username;
        var comment = $scope.comment;
        var imageid = $location.path().split('/').pop();
        console.log('username', username, 'comment', comment, 'imageid', imageid);

        var commentUrl = '/image/' + $location.path().split('/').pop();
        console.log(commentUrl);
        $http({
          url: commentUrl,
          method: 'POST',
          data: {
            username: username,
            comment: comment,
            imageid: imageid
          }

        })
          $http.get(imgUrl).then(function(resp) {
            console.log(resp.data);
            $scope.imageWComment = resp.data;
          });
      
        $scope.err = 'comment posted'

      };

    };

    // $scope.like = function(aValue) {
    //   var imageid = $location.path().split('/').pop();
    //   console.log('liked?', aValue);
    //   $http({
    //     url: '/like',
    //     method: 'POST',
    //     data: {
    //       aValue: aValue,
    //       imageid: imageid
    //     }
    //
    //   })
    // }

  })

  .controller('taggedCtrl', function($scope, $http, $location) {
    $scope.showMore = function() {
      console.log('clicked');
      $scope.displayLimit += 8;
    };
    var taggedUrl = '/tagged/' + $location.path().split('/').pop();
    $http.get(taggedUrl).then(function(resp) {
      $scope.taggedImages = resp.data;
      console.log($scope.taggedImages);
    });
  })
