'use strict'

var yaokiski = angular.module( 'yaokiski', [] )

.config( [ function() {} ] )

.factory( 'display', [ 'url', function( url ) {
	var display = {};

	display.data = {
		"control":	null,
		"device":	{},
		"screen":	null,
	};

	display.instance = function( data ) {
		try {
			url.isValid( data.url );
			this.setSize( data.size );
			this.setScreen( data.screen );

			window.open(
				data.uri,
				'',
				'menubar=no, toolbar=no, resizable=no, scrollbars=yes, height=' + this.data.control.height + ',width=' + this.data.control.width + ',left=' + this.data.device.left + ',top=' + this.data.device.top
			);
		}	// end try

		catch( error ) {
			console.error( error.message );
		}	// end catch
	};

	display.setScreen = function( screen ) {
		if( ! screen )
			throw new Error( 'No data of display.' );

		this.data.screen = screen;

		this.data.device = {
			"left":	( this.data.screen.width / 2 ) - ( this.data.control.width / 2 ),
			"top":	( this.data.screen.height / 2 ) - ( this.data.control.height / 2 ),
		};
	};

	display.setSize = function( size ) {
		display.data.control = size || {
			"height":	300,
			"width":	600,
		};
	};

	return display;
} ] )

.factory( 'network', [ 'display', function( display ) {
	var network = {};

	network.check = function( data ) {
		if( ! data || ! data.content || ! data.network || ! data.screen || ! data.url )
			throw new Error( 'Wrong data.' );

		return this.prepare( data );
	};

	network.prepare = function( data ) {
		var share = null;
		
		switch( data.network ) {
			case 'facebook':
				share = 'https://www.facebook.com/sharer/sharer.php?u=' + data.url;
				break;
			case 'google-plus':
				share = 'https://plus.google.com/share?url=' + data.url;
				break;
			case 'pinterest':
				share = 'http://pinterest.com/pin/create/button/?url=' + data.url + '&description=' + data.content + '&media=' + data.media;
				break;
			case 'twitter':
				share = 'https://twitter.com/share?via=CHANGE_USER&text=' + data.content + '&url=' + data.url;
				break;
			case 'whatsapp':
				location.href = encodeURI( 'whatsapp://send?text=CHANGE_USER: ' + data.content + ' ' + data.url );
				break;
		}	// end switch

		return encodeURI( share );
	};

	network.share = function( data ) {
		try {
			data.uri = this.check( data );
			display.instance( data );
		}	// end try

		catch( error ) {
			console.error( error.message );
		}	// end catch
	};

	return network;
} ] )

.factory( 'request', [ '$http', 'url', function( $http, url ) {
	var request = {};

	request.data = null;

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
			this.url.isValid( url );

			object = $http( {
				method:	'GET',
				url:	url,
				params:	params,
				transformResponse:	function( data, headersGetter, status ) {
					return JSON.parse( data );
				},
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
			this.url.isValid( url );
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
				},
			} );
		}	// end try

		catch( error ) {
			console.error( error.message );
		}	// end catch

		return object;
	};

	request.url = url;

	return request;
} ] )

.factory( 'url', [ 'useful', function( useful ) {
	var url = {};

	// TODO: Check
	url.controller = {
		"test":			"test.php",
		"wordpress":	"/wp-admin/admin-ajax.php",
	};

	url.isValid = function( url ) {
		if( ! url )
			throw new Error( 'Invalid URL in the Request.' );
	};

	// TODO: Check
	url.setController = function( data ) {
		try {
			this.controller = useful.merge( this.controller, data );
		}	// end try

		catch( error ) {
			console.error( error.message );
		}	// end catch
	};

	return url;
} ] )

.factory( 'storage', [ function() {
	var storage = {};

	storage.expire = ( 24 * 60 * 60 * 1000 ) * 30;

	storage.getData = function( object ) {
		try {
			this.check();

			if( ! ( object && typeof object === 'string' ) )
				throw new Error( 'Incorrect parameters.' );

			var data = this.local.getItem( object );

			if( ! data )
				throw new Error( 'Error obteniendo los datos.' );

			var store = JSON.parse( data );
			var expire = new Date( store.time ).getTime() + ( this.expire );
			var now = new Date().getTime();
		}	// end try

		catch( error ) {
			console.error( error.message );
		}	// end catch

		return now > expire ? false : store.data;
	};

	storage.check = function() {
		if( ! this.local )
			throw new Error( 'Don\'t support local storage.' );
	};

	storage.local = localStorage || null;

	storage.setData = function( object, data ) {
		try {
			this.check();

			if( ! ( object && typeof object === 'string' && data && typeof data === 'object' ) )
				throw new Error( 'Incorrect parameters.' );

			var store = { time: new Date(), "data": data };
			console.debug( 'Save Object ' + object );
		}	// end try

		catch( error ) {
			console.error( error.message );
		}	// end catch

		return this.local.setItem( object, JSON.stringify( store ) );
	};

	return storage;
} ] )

.factory( 'useful', [ function() {
	var useful = {};

	useful.merge = function( base, object ) {
		if( typeof base != 'object' || typeof object != 'object' )
			throw new Error( 'Incorrect parameters.' );

		if( typeof Object.assign != undefined )
			return Object.assign( base, object );

		else {
			var data = [];

			console.debug( 'Alternative!' );

			for( var index in base )
				data.push( base[ index ] );

			for( var index in object )
				data.push( object[ index ] );

			return data;
		}	// end else
	};

	return useful;
} ] )

.factory( 'validation', [ function() {
	var validation = {
		"card":	{
			"cvc":			/^\d{3,4}$/,
			"exp_month":	/^\d{2}$/,
			"exp_year":		/^\d{4}$/,
			"number":		/^\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{3,4}$/,
		},
		"contact":	{
			"email":	/^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
			"message":	/.{10,500}/,
			"name":		/^(?=.*[aeiouáàäâãåąæāéèëêęėēíïìîįīóòöôõøœōúüùûū])(?=.*[bcdfghjklmnñpqrstvwxyz])[a-zñ áàäâãåąæāéèëêęėēíïìîįīóòöôõøœōúüùûū]{3,100}$/i,
			"subject":	/^(?=.*[(aeiouáàäâãåąæāéèëêęėēíïìîįīóòöôõøœōúüùûū)|(bcdfghjklmnñpqrstvwxyz)|(0-9)])[\w aeiouáàäâãåąæāéèëêęėēíïìîįīóòöôõøœōúüùûū]{3,100}$/i,
			"tel":		/^\+?(\d{1,3})?[- .]?\(?(?:\d{2,3})\)?[- .]?\d{3,4}[- .]?\d{3,4}$/,
		},
		"login":	{
			"password":	/^\d{4}$/,
		}
	};

	return validation;
} ] )

.controller( 'YaokiskiController', [ '$scope', 'request', 'validation', 'network', function( $scope, request, validation, network ) {
	$scope.validation = validation;

	$scope.go = function( url ) {
		try {
			request.url.isValid( url )
			location.href = url;	
		}	// end try

		catch( error ) {
			console.error( error.message );
		}	// end catch
	};

	$scope.share = function( event, data, url, type ) {
		event.preventDefault();

		network.share( {
			"content":	data.content || null,
			"media":	data.media || null,
			"network":	type,
			"screen":	window.screen,
			"url":		url,
		} );
	};
} ] );