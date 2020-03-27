"use strict";

const ejs = require( "ejs" );
const inert = require( "@hapi/inert" );
const vision = require( "@hapi/vision" );

const auth = require( "./auth" );
const sql = require( "./sql" );

module.exports.register = async server => {
	await server.register( [ auth, inert, vision, sql ] );

	server.views( {
		engines: { ejs },
		relativeTo: __dirname,
		path: "../templates",
		layout: true
	} );
};
