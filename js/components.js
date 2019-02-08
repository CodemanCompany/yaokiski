app.component( 'contact', {
	"controller":	[ '$scope', 'request', 'validation', ( $scope, request, validation ) => {
		$scope.loading = false;
		$scope.validation = validation;

		$scope.action = () => {
			if( $scope.form.$invalid ) {
				$scope.form.email.$pristine = false;
				$scope.form.message.$pristine = false;
				$scope.form.name.$pristine = false;
				$scope.form.subject.$pristine = false;
				$scope.form.tel.$pristine = false;
				return;
			}	// end if

			grecaptcha.ready( () => {
				grecaptcha.execute( '6LcWlosUAAAAANwj1zfKXKmOpfyQHczJiXvlwRBj', { "action": "homepage" } )
				.then( ( token ) => {
					Swal.fire( {
						"allowOutsideClick": false,
						"text": "Espere un momento por favor.",
						"title": "Enviando mensaje ...",
					} )
					Swal.showLoading();
		
					$scope.input[ 'g-recaptcha-response' ] = token;
					request.post( '/controller/contact.php', $scope.input, false )
					.then( function( response ) {
						Swal.close();
		
						if( request.check( response ) ) {
							Swal.fire( {
								"confirmButtonText": "Aceptar",
								"text": "Operación realizada con éxito.",
								"title": "Éxito",
								"type": "success",
							} );
						}	// end if
						else {
							Swal.fire( {
								"confirmButtonText": "Aceptar",
								"text": "Por el momento no se puede realizar la operación, intente de nueva más tarde.",
								"title": "Atención",
								"type": "error",
							} );
						}	// end else
		
						$scope.reset();
					}, function( error ) {} );	
				} );
			} );
		};

		$scope.reset = () => {
			$scope.loading = false;
			$scope.form.$setPristine();
			$scope.input = {};
		};
	} ],
	"templateUrl":	'/component/contact.html',
} )

.component( 'login', {
	"controller":	[ '$scope', 'request', 'storage', 'validation', ( $scope, request, storage, validation ) => {
		$scope.input = {};
		$scope.loading = false;
		$scope.validation = validation;

		// console.log( storage.getData( 'name' ) );

		$scope.action = () => {
			if( $scope.form.$invalid ) {
				$scope.form.user.$pristine = false;
				$scope.form.password.$pristine = false;
				return;
			}	// end if

			$scope.reset();

			// if( input.remember  )

			$scope.loading = true;

			// request.post( '', $scope.input )
			// .then( function( response ) {
			// 	if( request.check( response ) ) {
					
			// 	}	// end if
			// 	$scope.reset();
			// }, function( error ) {} );
		};

		$scope.reset = () => {
			$scope.loading = false;
			$scope.form.$setPristine();
			$scope.input = {};
		};
	} ],
	"templateUrl":	'/component/login.html',
} );