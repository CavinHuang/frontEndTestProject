import ajax from '../modules/ajax/ajax.js'

// let ajaxCtrl = new ajax( {
// 	url: 'http://result.eolinker.com/zV3hCFK9b4bf5cdb7381fe38284a05d44d0631cf253c095',
// 	data: {
// 		uri: 'test'
// 	},
// 	success: ( data ) => {
// 		console.log( data );
// 	}
// } );
//
// ajaxCtrl.init()
// ajaxCtrl.debug()

let ajaxC = new ajax()
ajaxC.get( 'http://result.eolinker.com/zV3hCFK9b4bf5cdb7381fe38284a05d44d0631cf253c095', {
	uri: 'test'
}, null, function ( res ) {
	console.log( res );
} )