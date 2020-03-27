"use strict";

const dataClient = require( "../data" );

module.exports = {
	name: "sql",
	version: "1.0.0",
	register: async server => {
		const config = server.app.config.sql;
		const client = await dataClient( server, config );
		server.expose( "client", client );
	}
}
;
