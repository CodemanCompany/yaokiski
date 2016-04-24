'use strict'

var app = angular.module( 'app', [ 'yaokiski' ] )

.controller( 'MainController', function( $controller, $scope ) {
	 $controller( 'YaokiskiController', { "$scope": $scope } );
} );