const path = require( 'path' );
const OpenBrowserWebpackPlugin = require( 'open-browser-webpack-plugin' )
const HTMLWebpackPlugin = require( "html-webpack-plugin" );

const port = process.env.NODE_ENV || 9000
const uri = "http://localhost:" + port
module.exports = {
	entry: {
		ajax: path.resolve( __dirname, './src/ajax/index.js' )
	},
	output: {
		filename: './js/[name].bundle.[hash].js',
		path: path.resolve( __dirname, './dist' )
	},
	module: {
		rules: [ {
			test: /\.js$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: [ 'es2015' ]
				}
			}
    } ]
	},
	devtool: 'eval',
	plugins: [
    new OpenBrowserWebpackPlugin( {
			url: uri
		} ),
    new HTMLWebpackPlugin( {
			filename: `ajax.html`,
			template: path.resolve( __dirname, `./src/ajax/index.html` ),
		} )
  ],
	devServer: {
		proxy: {
			'/api': {
				target: 'http://www.wvmp360.com',
				changeOrigin: true,
				pathRewrite: {
					'^/': ''
				}
			}
		},
		contentBase: path.resolve( __dirname, './dist' ),
		// hot: true,
		port: port,
		overlay: {
			errors: true,
			warnings: true
		}
	}
}