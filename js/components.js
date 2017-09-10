app.component( 'contact', {
	"controller":	[ '$scope', 'request', function( $scope, request ) {
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

			// request.post( '', $scope.input )
			// .then( function( response ) {
			// 	if( request.check( response ) ) {
					
			// 	}	// end if
			// 	$scope.reset();
			// }, function( error ) {} );
		};

		$scope.reset = function() {
			$scope.recaptcha = false;
			grecaptcha.reset();
			$scope.form.$setPristine();
			$scope.input = {};
		};	
	} ],
	"templateUrl":	'/component/contact.html',
} );

.component( 'login', {
	"controller":	[ '$scope', 'request', 'storage', function( $scope, request, storage ) {
		$scope.input = {};

		console.log( storage.getData( 'name' ) );

		$scope.action = function() {
			if( $scope.form.$invalid ) {
				$scope.form.user.$pristine = false;
				$scope.form.password.$pristine = false;
				return;
			}	// end if

			$scope.reset();

			// if( input.remember  )

			// request.post( '', $scope.input )
			// .then( function( response ) {
			// 	if( request.check( response ) ) {
					
			// 	}	// end if
			// 	$scope.reset();
			// }, function( error ) {} );
		};

		$scope.reset = function() {
			$scope.form.$setPristine();
			$scope.input = {};
		};
	} ],
	"templateUrl":	'/component/login.html',
} );