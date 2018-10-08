//upload s3 
var app = angular.module('upload_s3', [
    'ngRoute',
    'ui.bootstrap.tpls',
    'ui.bootstrap',
    'ngResource'
]);
app.config(['$routeProvider', '$httpProvider' ,function($routeProvider, $httpProvider){
    $routeProvider
    .when('/home', {
        templateUrl : 'templates/uploadFile.html',
        controller: 'uploadFile'
    })
}]);