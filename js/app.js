const app = angular.module( 'app', [ 'ngRoute', 'yaokiski' ] )

.config( [ '$routeProvider', '$locationProvider', function( $routeProvider, $locationProvider ) {
	$routeProvider
	.when( '/', {
		"templateUrl":	'structure/home.html'
	} )
	.when( '/contact', {
		"templateUrl":	'structure/contact.html'
	} )
	.when( '/login', {
		"templateUrl":	'structure/login.html'
	} )
	.otherwise( {
		"redirectTo":	'/'
	} );

	$locationProvider.html5Mode( true );
} ] )

.controller( 'MainController', [ '$controller', '$scope', function( $controller, $scope ) {
	$controller( 'YaokiskiController', { "$scope": $scope } );
} ] );