/**
 * xmlHttpRequest 练习项目
 */
function json2url( json ) {
	var arr = [];
	for ( var name in json ) {
		arr.push( name + '=' + json[ name ] );
	}
	return arr.join( '&' );
}

class ajaxClass {
	constructor( options ) {
		// 自身使用的request类
		this._ajax = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject( 'Microsoft.XMLHTTP' );
		this.defaultOptios = {
			method: 'GET',
			timeout: 3000,
			data: {},
			header: {},
			dataType: 'json'
		}
		this.options = Object.assign( {}, this.defaultOptios, options )
		this._data = ''
	}

	/**
	 * 初始化
	 * @return {[type]} [description]
	 */
	init() {
		if ( this.options.hasOwnProperty( 'url' ) ) this.errorHandel( 'url exits' )

		this._ajax.timeout = this.options.timeout

		this.parseData()
		this.send()
	}

	/**
	 * 提供简便的方法创建实例
	 * @param  {[type]} method  [description]
	 * @param  {[type]} url     [description]
	 * @param  {[type]} data    [description]
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 */
	createInstance( method, url, data = {}, options = {}, callback ) {

		let sysOptions = {
			method: method,
			url: url,
			data: data,
		}
		if ( callback ) sysOptions[ 'success' ] = callback
		this.options = Object.assign( {}, this.defaultOptios, sysOptions, options )
		this.init()

		return this
	}

	/**
	 * 处理数据
	 * @return {[type]} [description]
	 */
	parseData() {
		this.buildUrl()

		let _dataStr = json2url( this.options.data )
		this.addSelfData( _dataStr )
	}

	/**
	 * 重新构建url，处理不规范的url
	 * @return {[type]} [description]
	 */
	buildUrl() {
		let url = this.options.url
		let _url, tmpStr = ''
		if ( url.indexOf( '?' ) !== -1 ) {
			let urlObj = url.split( '?' )
			_url = urlObj[ 0 ]
			if ( urlObj[ 1 ].length > 0 && urlObj[ 1 ].indexOf( '=' ) ) {
				tmpStr = urlObj[ 1 ]
			}
		}
		this.options.url = _url ? _url : url
		this.addSelfData( tmpStr )
	}

	/**
	 * 增加私有data
	 * @param {[type]} str [description]
	 */
	addSelfData( str ) {
		this._data = this._data[ this._data.length - 1 ] == '&' || this._data == '' ? this._data + str : this._data + '&' + str
	}

	/**
	 * 设置header
	 */
	setRequestHeader() {
		for ( let k in this.options.header ) {
			this._ajax.setRequestHeader( k, this.options.header[ k ] )
		}
	}

	/**
	 * 发送请求
	 * @return {[type]} [description]
	 */
	send() {
		// this._ajax.responseType = this.options.dataType

		this.setRequestHeader(); // 设置头部
		// 判断请求类型
		switch ( this.options.method.toLowerCase() ) {
		case 'get':
			this._ajax.open( 'GET', this.options.url + '?' + this._data, true )
			this._ajax.send()
			break;
		default:
			this._ajax.open( this.options.method.toUpperCase(), this.options.url, true )
			this._ajax.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' )
			this._ajax.send( this._data )
		}
		// 响应请求
		this.fireHooks( 'beforeSend' )
		this._ajax.onreadystatechange = ( evt ) => {
			let state = this._ajax.readyState
			if ( state === 2 ) {
				this.fireHooks( 'sendSucess' )
			} else if ( state === 3 ) {
				this.fireHooks( 'getPathData' )
			} else if ( state === 4 ) {
				if ( this._ajax.status >= 200 && this._ajax.status < 300 || this._ajax.status === 304 ) {
					this.response = this.responseHandle( this._ajax.responseText )
					this.success()
					this.fireHooks( 'finish' )
				} else {
					this.errorHandel( this._ajax.status )
				}
			}
		}
	}
	/**
	 * 触发钩子函数
	 * @param  {[type]} handle [description]
	 * @return {[type]}        [description]
	 */
	fireHooks( handle, args ) {
		let arg = args ? args : this._ajax
		this.options.hasOwnProperty( handle ) && this.options[ handle ].call( this, arg )
	}

	debug() {
		console.log( this._ajax );
	}

	/**
	 * 请求发送成功，并取回数据
	 * @return {[type]} [description]
	 */
	success() {
		this.options.hasOwnProperty( 'success' ) && this.options[ 'success' ].call( this, this.response )
	}

	/** 处理返回结果
	 * [responseHandle description]
	 * @return {[type]} [description]
	 */
	responseHandle( res ) {
		let obj
		try {
			obj = this.options.dataType.toLowerCase() == 'json' ? JSON.parse( res ) : res
		} catch ( e ) {
			obj = res
		}
		return obj
	}

	/**
	 * 处理过程中的错误
	 * @return {[type]} [description]
	 */
	errorHandel( msg ) {
		return new Error( msg );
	}
}
//
[ 'POST', 'GET', 'PUT', 'DELETE', 'PATCH', 'OPTIONS' ].forEach( e => {
	ajaxClass.prototype[ e ] = function ( url, data, options, callback ) {
		if ( options instanceof Function && !callback ) {
			callback = options
			option = null
		}
		return this.createInstance( e, url, data, options, callback )
	}
} )
export default ajaxClass