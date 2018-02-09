import ajax from '../modules/ajax/ajax_promise.js'

// let ajaxCtrl = new ajax( {
// 	url: 'http://result.eolinker.com/zV3hCFK9b4bf5cdb7381fe38284a05d44d0631cf253c095',
// 	data: {
// 		uri: 'test'
// 	},
// 	success: ( data ) => {
// 		console.log( data );
// 	},
// 	beforeSend: ( ajax ) => {
// 		console.error( 'beforeSend' );
// 	}
// } );
//
// ajaxCtrl.init()
// ajaxCtrl.debug()

let ajaxC = new ajax()
ajaxC.get( 'http://result.eolinker.com/zV3hCFK9b4bf5cdb7381fe38284a05d44d0631cf253c095', {
		uri: 'test'
	} )
	.then( res => {
		console.log( res );
		ajaxC.post( 'http://result.eolinker.com/zV3hCFK9b4bf5cdb7381fe38284a05d44d0631cf253c095?uri=testPost', {} )
			.then( res => {
				console.log( res );
				ajaxC.put( 'http://result.eolinker.com/zV3hCFK9b4bf5cdb7381fe38284a05d44d0631cf253c095?uri=testPut', {} )
					.then( res => {
						console.log( res );
					} )
					.catch( e => {
						console.error( e );
					} )
			} )
			.catch( e => {
				console.error( e );
			} )
	} )
	.catch( e => {
		console.error( e );
	} )