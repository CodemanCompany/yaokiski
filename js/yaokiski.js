'use strict'

var yaokiski = angular.module( 'yaokiski', [] )

.config( function() {} )

.factory( 'request', function( $http, url ) {
	var request = {};

	request.data = null;

	request.isValid = function( url ) {
		if( ! url )
			throw new Error( 'Invalid URL in the Request.' );
	};

	request.youHaveparameters = function( params ) {
		if( ! params )
			throw new Error( 'No data.' );
	};

	request.getData = function( response ) {
		return this.data || response.data || response || null;
	};

	request.get = function( url, params ) {
		var object = null;

		try {
			this.isValid( url );

			object = $http( {
				method:	'GET',
				url:	url,
				params:	params,
				transformResponse:	function( data, headersGetter, status ) {
					return JSON.parse( data );
				}
			} );
		}	// end try

		catch( error ) {
			console.error( error.message );
		}	// end catch

		return object;
	};

	request.check = function( response ) {
		if( ! response.data.status || response.data.status !== 'success' )
			return false;

		this.data = response.data;
		return true;
	};

	request.isWarning = function( response ) {
		if( ! response.data.status || response.data.status !== 'warning' )
			return false;

		return true;
	};

	request.post = function( url, data ) {
		var object = null;

		try {
			this.isValid( url );
			this.youHaveparameters( data );

			object = $http( {
				method:		'POST',
				url:		url,
				headers:	{ 'Content-Type': undefined },
				data:		data,
				transformRequest:	function( data, headersGetter ) {
					var formData = new FormData();

					angular.forEach( data, function( value, key ) {
						formData.append( key, value );
					} );

					return formData;
				},
				transformResponse:	function( data, headersGetter, status ) {
					return JSON.parse( data );
				}
			} );
		}	// end try

		catch( error ) {
			console.error( error.message );
		}	// end catch

		return object;
	};

	return request;
} )

// TODO: ver si va en este módulo
.factory( 'url', function() {
	var url = {};

	url.controller = null;

	// url.setController = function( data ) {
	// 	this.controller = data;
	// };

	return url;
} )

.factory( 'validation', function() {
	var validation = {
		"email":	/^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
		"message":	/.{10,500}/,
		"name":		/^(?=.*[aeiouáàäâãåąæāéèëêęėēíïìîįīóòöôõøœōúüùûū])(?=.*[bcdfghjklmnñpqrstvwxyz])[a-zñ áàäâãåąæāéèëêęėēíïìîįīóòöôõøœōúüùûū]{3,100}$/,
		"subject":	/^(?=.*[(aeiouáàäâãåąæāéèëêęėēíïìîįīóòöôõøœōúüùûū)|(bcdfghjklmnñpqrstvwxyz)|(0-9)])[\w aeiouáàäâãåąæāéèëêęėēíïìîįīóòöôõøœōúüùûū]{3,100}$/,
		"tel":		/^\+?(\d{1,3})?[- .]?\(?(?:\d{2,3})\)?[- .]?\d{3,4}[- .]?\d{3,4}$/
	};

	return validation;
} )

.controller( 'ContactController',[ '$scope', 'request', 'validation', function( $scope, request, validation ) {
	$scope.validation = validation;

	$scope.reset = function() {
		$scope.recaptcha = false;
		grecaptcha.reset();
		$scope.form.$setPristine();
	};

	$scope.action = function() {
		if( $scope.form.$invalid ) {
			$scope.form.email.$pristine = false;
			$scope.form.message.$pristine = false;
			$scope.form.name.$pristine = false;			
			$scope.form.subject.$pristine = false;
			$scope.form.tel.$pristine = false;

			return;
		}	// end if

		$scope.input[ 'g-recaptcha-response' ] = angular.element( '#g-recaptcha-response' ).val();
		if( ! $scope.input[ 'g-recaptcha-response' ] ) {
			$scope.recaptcha = true;
			return;
		}	// end if

		request.get( 'http://familia.artezia.mx/js/controller/MainController.js', function( response ) {
			if( request.check( response ) ) {

			}	// end if
			$scope.reset();
		} )
	};
} ] );