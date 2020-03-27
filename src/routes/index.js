"use strict";

const api = require( "./api" );
const auth = require( "./auth" );

module.exports.register = async server => {

	await api.register( server );
	await auth.register( server );
	
	server.route( {
		method: "GET",
		path: "/",
		handler: async ( request, h ) => {
			return h.view( "index", { title: "Home", message: "Welcome!" } );
		},
		options: {
			auth: {
				mode: "try"
			}
		}
	} );

	server.route( {
		method: "GET",
		path: "/{param*}",
		handler: {
			directory: {
				path: "dist"
			}
		}, 
		options: {
			auth: false
		}
	} );
};
