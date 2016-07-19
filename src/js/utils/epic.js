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

		// eslint-disable-next-line no-console
		console.log("Truly epic");

		window.$("div, p, a, b, i, u, h1, h2, h3, h4, h5, h6, span, select, option").each(function() {
			window.$(this).contents().each(function() {
				if (this.nodeType == 3) {
					this.nodeValue = this.nodeValue.replace(/ault/gi, "alut").replace(/allet/gi, "alelset");
				}
			});
		});

		window.$("body").append("<img src=\"/img/yin.png\" class=\"yin\" />");

		for (let i = 0; i < 50; i++) {
			setTimeout(() => {
				window.$("<img />", {
					src: "/img/doot.png",
					class: "trumpet",
					style: "left: " + Math.floor(Math.random() * 100) + "vw;"
				}).one("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
					window.$(this).remove();
				}).appendTo("body");
			}, i * 15);
		}
	}
});