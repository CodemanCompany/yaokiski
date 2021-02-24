//  ██████╗ ██████╗ ██████╗ ███████╗███╗   ███╗ █████╗ ███╗   ██╗
// ██╔════╝██╔═══██╗██╔══██╗██╔════╝████╗ ████║██╔══██╗████╗  ██║
// ██║     ██║   ██║██║  ██║█████╗  ██╔████╔██║███████║██╔██╗ ██║
// ██║     ██║   ██║██║  ██║██╔══╝  ██║╚██╔╝██║██╔══██║██║╚██╗██║
// ╚██████╗╚██████╔╝██████╔╝███████╗██║ ╚═╝ ██║██║  ██║██║ ╚████║
//  ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝
// @author Codeman Team
// @version 0.23

const yaokiski = angular.module( 'yaokiski', [] )

.config( [ () => {} ] )

.factory( 'display', [ 'url', ( url ) => {
	let display = {};

	display.data = {
		"control": null,
		"device": {},
		"screen": null,
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
			"left": ( this.data.screen.width / 2 ) - ( this.data.control.width / 2 ),
			"top": ( this.data.screen.height / 2 ) - ( this.data.control.height / 2 ),
		};
	};

	display.setSize = function( size ) {
		display.data.control = size || {
			"height": 300,
			"width": 600,
		};
	};

	return display;
} ] )

.factory( 'network', [ 'display', ( display ) => {
	let network = {};

	network.check = function( data ) {
		if( ! data || ! data.content || ! data.network || ! data.screen || ! data.url )
			throw new Error( 'Wrong data.' );

		return this.prepare( data );
	};

	network.prepare = ( data ) => {
		let share = null;
		
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
				window.open( encodeURI( 'whatsapp://send?text=CHANGE_USER: ' + data.content + ' ' + data.url ) );
				return;
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

.factory( 'request', [ '$http', 'url', ( $http, url ) => {
	let request = {};

	request.data = null;
	request.token = 'CODEMAN_TOKEN';
	request.url = {
		"api": "",
		"page": "",
	};

	request.check = function( response ) {
		if( ! response.data.status || response.data.status !== 'success' )
			return false;

		this.data = response.data;
		return true;
	};

	request.getData = function( response ) {
		return this.data || response.data || response || null;
	};

	request.getToken = function() {
		this.token = localStorage.getItem( 'token' ) || '';
		return this.token;
	};

	request.setToken = function( token ) {
		localStorage.setItem( 'token', token );
		this.token = token;
	};

	request.getHeaders = function( activate = true ) {
		this.getToken();

		return {
			"Accept": "application/json",
			"Content-Type": activate ? "application/json" : undefined,
			"Authorization": "Bearer " + this.token
		};
	};

	request.isWarning = ( response ) => {
		if( ! response.data.status || response.data.status !== 'warning' )
			return false;

		return true;
	};

	request.lang = {
		"sEmptyTable": "Ningún dato disponible en esta tabla",
		"sInfo":  "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
		"sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
		"sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
		"sInfoPostFix":  "",
		"sInfoThousands": ",",
		"sLengthMenu": "Mostrar _MENU_ registros",
		"sLoadingRecords": "Espere un momento por favor.",
		"sProcessing": "Procesando...",
		"sSearch": "Buscar:",
		"sUrl": "",
		"sZeroRecords": "No se encontraron resultados",
		"oPaginate": {
			"sFirst": "Primero",
			"sLast": "Último",
			"sNext": "Siguiente",
			"sPrevious": "Anterior",
		},
		"oAria": {
			"sSortAscending": ": Activar para ordenar la columna de manera ascendente",
			"sSortDescending": ": Activar para ordenar la columna de manera descendente",
		},
	};

	request.transform = ( data ) => {
		let formData = new FormData();
		angular.forEach( data, function( value, key ){
			if( Array.isArray( value ) ) {
				value.forEach( ( element, index, array ) => {
					formData.append( key + '[]', element );	
				} );
			}	// end if
			else
				formData.append( key, value );
		} );

		return formData;
	};	// end transform

	request.delete = function( url, data ) {
		let object = null;

		try {
			this.url.isValid( url );

			object = $http( {
				"headers": this.getHeaders(),
				"method": "DELETE",
				"data": data,
				transformResponse:	( data, headersGetter, status ) => JSON.parse( data ),
				"url": url,
			} );
		}	// end try

		catch( error ) {
			console.error( error.message );
		}	// end catch

		return object;
	};

	request.get = function( url, params ) {
		let object = null;

		try {
			this.url.isValid( url );

			object = $http( {
				"headers": this.getHeaders(),
				"method": "GET",
				"params": params,
				"transformResponse": ( data, headersGetter, status ) => JSON.parse( data ),
				"url": url,
			} );
		}	// end try

		catch( error ) {
			console.error( error.message );
		}	// end catch

		return object;
	};

	request.post = function( url, data, json = true ) {
		let object = null;

		try {
			this.url.isValid( url );
			this.youHaveparameters( data );

			if( json === true )
				object = $http( {
					"data": data,
					"headers": this.getHeaders(),
					"method": "POST",
					"transformResponse": ( data, headersGetter, status ) => JSON.parse( data ),
					"url": url,
				} );
			else
				object = $http( {
					"data": data,
					"headers": this.getHeaders( false ),
					"method": "POST",
					"transformRequest": ( data, headersGetter ) => {
						return this.transform( data );
					},
					"transformResponse": ( data, headersGetter, status ) => JSON.parse( data ),
					"url": url,
				} );
		}	// end try

		catch( error ) {
			console.error( error.message );
		}	// end catch

		return object;
	};

	request.put = function( url, data ) {
		let object = null;

		try {
			this.url.isValid( url );
			this.youHaveparameters( data );

			object = $http( {
				"data": data,
				"headers": this.getHeaders(),
				"method": "PUT",
				"transformResponse": ( data, headersGetter, status ) => JSON.parse( data ),
				"url": url,
			} );
		}	// end try

		catch( error ) {
			console.error( error.message );
		}	// end catch

		return object;
	};

	request.url = url;

	request.youHaveparameters = ( params ) => {
		if( ! params )
			throw new Error( 'No data.' );
	};

	return request;
} ] )

.factory( 'url', [ 'useful', function( useful ) {
	let url = {};

	// TODO: Check
	url.controller = {
		"test": "test.php",
		"wordpress": "/wp-admin/admin-ajax.php",
	};

	url.isValid = ( url ) => {
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

.factory( 'storage', [ () => {
	let storage = {};

	storage.expire = ( 24 * 60 * 60 * 1000 ) * 30;

	storage.getData = function( object ) {
		try {
			this.check();

			if( ! ( object && typeof object === 'string' ) )
				throw new Error( 'Incorrect parameters.' );

			const data = this.local.getItem( object );

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

.factory( 'useful', [ () => {
	let useful = {};

	useful.merge = ( base, object ) => {
		if( typeof base != 'object' || typeof object != 'object' )
			throw new Error( 'Incorrect parameters.' );

		if( typeof Object.assign != undefined )
			return Object.assign( base, object );

		else {
			const data = [];

			console.debug( 'Alternative!' );

			for( let index in base )
				data.push( base[ index ] );

			for( let index in object )
				data.push( object[ index ] );

			return data;
		}	// end else
	};

	return useful;
} ] )

.factory( 'validation', [ () => {
	const validation = {
		"people": {
			"curp": null,
			"rfc": /^([A-ZÑ&]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1]))([0-9A-Z]{3})?$/i,
		},
		"card":	{
			"cvc": /^\d{3,4}$/,
			"exp_month": /^\d{2}$/,
			"exp_year": /^\d{4}$/,
			"number": /^\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{3,4}$/,
		},
		"contact":	{
			"email": /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
			"message": /.{10,500}/,
			"name": /^(?=.*[aeiouáàäâãåąæāéèëêęėēíïìîįīóòöôõøœōúüùûū])(?=.*[bcdfghjklmnñpqrstvwxyz])[a-zñ áàäâãåąæāéèëêęėēíïìîįīóòöôõøœōúüùûū]{3,100}$/i,
			"subject": /^(?=.*[(aeiouáàäâãåąæāéèëêęėēíïìîįīóòöôõøœōúüùûū)|(bcdfghjklmnñpqrstvwxyz)|(0-9)])[\w aeiouáàäâãåąæāéèëêęėēíïìîįīóòöôõøœōúüùûū]{3,100}$/i,
			"tel": /^\+?(\d{1,3})?[- .]?\(?(?:\d{2,3})\)?[- .]?\d{3,4}[- .]?\d{3,4}$/,
		},
		"login":	{
			"password": /.{8,40}/,
		}
	};

	return validation;
} ] )

.controller( 'YaokiskiController', [ '$scope', 'network', 'request', function( $scope, network, request ) {
	$scope.go = ( url ) => {
		try {
			request.url.isValid( url )
			location.href = url;
		}	// end try

		catch( error ) {
			console.error( error.message );
		}	// end catch
	};

	$scope.share = ( event, data, url, type ) => {
		event.preventDefault();

		network.share( {
			"content": data.content || null,
			"media": data.media || null,
			"network": type,
			"screen": window.screen,
			"url": url,
		} );
	};
} ] );