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
			json: true
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
			success: callback
		}

		this.options = Object.assign( {}, this.defaultOptios, sysOptions, options )
		this.init()
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
		this.setRequestHeader(); // 设置头部
		// 判断请求类型
		switch ( this.options.method.toLowerCase() ) {
		case 'get':
			this._ajax.open( 'GET', this.options.url + '?' + this._data, true )
			this._ajax.send()
			break;
		case 'post':
			this._ajax.open( 'POST', this.options.url, true )
			this._ajax.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' )
			this._ajax.send( this._data )
		}
		// 响应请求
		this._ajax.onreadystatechange = ( evt ) => {
			if ( this._ajax.readyState === 4 ) {
				if ( this._ajax.status >= 200 && this._ajax.status < 300 || this._ajax.status === 304 ) {
					this.success( this._ajax.responseText )
				} else {
					this.errorHandel( this._ajax.status )
				}
			}
		}
	}

	debug() {
		console.log( this._ajax );
	}

	/**
	 * 发请求之前钩子
	 * @return {[type]} [description]
	 */
	beforeSend() {}

	/**
	 * 请求发送成功，并取回数据
	 * @return {[type]} [description]
	 */
	success( response ) {
		this.options[ 'success' ].call( this, this.responseHandle( response ) )
	}

	/** 处理返回结果
	 * [responseHandle description]
	 * @return {[type]} [description]
	 */
	responseHandle( res ) {
		let obj
		try {
			obj = this.options.json ? JSON.parse( res ) : res
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
// "put", "patch", "head", "delete"
[ "get", "post" ].forEach( e => {
	ajaxClass.prototype[ e ] = function ( url, data, option, callback ) {
		return this.createInstance( e, url, data, option, callback )
	}
} )
export default ajaxClass