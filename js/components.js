app.component( 'contact', {
	"controller":	[ '$scope', 'request', 'validation', ( $scope, request, validation ) => {
		$scope.input = {};
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
					.then( ( response ) => {
						Swal.close();
		
						if( request.check( response ) ) {
							Swal.fire( {
								"confirmButtonText": "Aceptar",
								"icon": "success",
								"text": "Operación realizada con éxito.",
								"title": "Éxito",
							} );
						}	// end if
						else {
							Swal.fire( {
								"confirmButtonText": "Aceptar",
								"icon": "error",
								"text": "Por el momento no se puede realizar la operación, intente de nueva más tarde.",
								"title": "Atención",
							} );
						}	// end else
		
						$scope.reset();
					}, ( error ) => {} );
				} );
			} );
		};

		$scope.reset = () => {
			$scope.form.$setPristine();
			$scope.input = {};
		};
	} ],
	"templateUrl":	'/component/contact.html',
} )

.component( 'login', {
	"controller":	[ '$scope', 'request', 'storage', 'validation', ( $scope, request, storage, validation ) => {
		$scope.input = {};
		$scope.validation = validation;

		// console.log( storage.getData( 'name' ) );

		$scope.action = () => {
			if( $scope.form.$invalid ) {
				$scope.form.user.$pristine = false;
				$scope.form.password.$pristine = false;
				return;
			}	// end if

			// if( input.remember  )

			Swal.fire( {
				"allowOutsideClick": false,
				"text": "Espere un momento por favor.",
				"title": "Verificando datos de acceso ...",
			} )
			Swal.showLoading();

			request.post( '/', $scope.input, false )
			.then( ( response ) => {
				Swal.close();

				if( request.check( response ) ) {
					// request.setToken( request.getData().auth.access_token );
					// location.href = '/';
				}	// end if
				else {
					Swal.fire( {
						"confirmButtonText": "Aceptar",
						"icon": "error",
						"text": "Datos de acceso incorrectos, por favor verifica la información.",
						"title": "Atención",
					} );
				}	// end else

				$scope.reset();
			}, ( error ) => {} );
		};

		$scope.reset = () => {
			$scope.form.$setPristine();
			$scope.input = {};
		};
	} ],
	"templateUrl":	'/component/login.html',
} );