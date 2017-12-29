// app/nav/nav.directive.js

angular.module('app.nav', [])

.directive('gtNavBar', function(){
    return {
        templateUrl: '/views/nav.html',
        restrict: 'E'
        // ,
        // controller: function($scope){
        //     $scope.showClick = function(e){
        //         console.log(e.currentTarget);
        //     }
        // }
    }
});
