"use strict";

const events = require( "./events" );

module.exports.register = async server => {
	await events.register( server );
};
