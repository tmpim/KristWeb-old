import {Behavior} from "backbone.marionette";

import app from "../app";

export default Behavior.extend({
	defaults: {
		code: [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]
	},

	initialize() {
		this.cache = [];
		window.$("body").keyup(this._epic.bind(this));
	},

	_epic(e) {
		if (this.options.code.length > this.cache.push(e.which)) return;
		if (this.options.code.length < this.cache.length) this.cache.shift();
		if (this.options.code.toString() !== this.cache.toString()) return;

		new Audio("/img/en_GB_en_GB_ai_ai.wav").play();
		app.epic = true;

		console.log("Truly epic");
	}
});