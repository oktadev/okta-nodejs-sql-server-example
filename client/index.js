import Datetime from "vue-datetime";
import Vue from "vue";
import "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import "vue-datetime/dist/vue-datetime.css";

import App from "./App";

Vue.use( Datetime );

new Vue( { // eslint-disable-line no-new
	el: "#app",
	render: h => h( App )
} );
