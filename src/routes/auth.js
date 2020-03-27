"use strict";

const boom = require( "@hapi/boom" );

const login = {
	method: "GET",
	path: "/login",
	handler: request => {
		if ( !request.auth.isAuthenticated ) {
			return `Authentication failed due to ${ request.auth.error.message }`;
		}
	}
};

const oAuthCallback = {
	method: "GET",
	path: "/authorization-code/callback",
	handler: ( request, h ) => {
		if ( !request.auth.isAuthenticated ) {
			throw boom.unauthorized( `Authentication failed: ${ request.auth.error.message }` );
		}
		request.cookieAuth.set( request.auth.credentials );
		return h.redirect( "/" );
	},
	options: {
		auth: "okta"
	}
};

const logout = {
	method: "GET",
	path: "/logout",
	handler: ( request, h ) => {
		try {
			if ( request.auth.isAuthenticated ) {
				request.cookieAuth.clear();
			}
			return h.redirect( "/" );
		} catch( err ) {
			console.log( err );
		}
	},
	options: {
		auth: {
			mode: "try"
		}
	}
};

module.exports.register = async server => {
	server.route( [ login, oAuthCallback, logout ] );
};
