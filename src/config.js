"use strict";

const dotenv = require( "dotenv" );
const assert = require( "assert" );

dotenv.config();

const {
	PORT,
	HOST,
	HOST_URL,
	COOKIE_ENCRYPT_PWD,
	SQL_SERVER,
	SQL_DATABASE,
	SQL_USER,
	SQL_PASSWORD,
	OKTA_ORG_URL,
	OKTA_CLIENT_ID,
	OKTA_CLIENT_SECRET
} = process.env;

const sqlEncrypt = process.env.SQL_ENCRYPT === "true";

assert( PORT, "PORT is required" );
assert( HOST, "HOST is required" );

module.exports = {
	port: PORT,
	host: HOST,
	url: HOST_URL,
	cookiePwd: COOKIE_ENCRYPT_PWD,
	sql: {
		server: SQL_SERVER,
		database: SQL_DATABASE,
		user: SQL_USER,
		password: SQL_PASSWORD,
		options: {
			encrypt: sqlEncrypt,
			enableArithAbort: true
		}
	},
	okta: {
		url: OKTA_ORG_URL,
		clientId: OKTA_CLIENT_ID,
		clientSecret: OKTA_CLIENT_SECRET
	}
};
