import "babel-polyfill";

window.CryptoJS = require("browserify-cryptojs");

require("browserify-cryptojs/components/enc-base64");
require("browserify-cryptojs/components/md5");
require("browserify-cryptojs/components/evpkdf");
require("browserify-cryptojs/components/cipher-core");
require("browserify-cryptojs/components/aes");
require("browserify-cryptojs/components/sha256");

import Backbone from "backbone";

import $ from "jquery";

Backbone.$ = window.jQuery = window.$ = $;
Backbone.emulateHTTP = true;

import MalihuCustomScrollbarPlugin from "malihu-custom-scrollbar-plugin";
MalihuCustomScrollbarPlugin(window.$);

import "./libs/dense.min";
import "prefixfree";
import "selectize";
import "./libs/selectize/dropdown-header";
import "cropper";
import "timeago";

window.$.timeago.settings.localeTitle = true;

import Marionette from "backbone.marionette";
import "backbone.modal";

import Handlebars from "hbsfy/runtime";
Handlebars.registerHelper("nl2br", function(text) {
	text = Handlebars.Utils.escapeExpression(text);
	let nl2br = (text + "").replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, "$1" + "<br>" + "$2");
	return new Handlebars.SafeString(nl2br);
});

import AddressPartial from "./partials/address.hbs";
Handlebars.registerPartial("address", AddressPartial);

Handlebars.registerHelper("addressLabel", address => {
	address = Handlebars.Utils.escapeExpression(address);

	const app = window.app;
	if (!app) return new Handlebars.SafeString(address);
	if (app.activeWallet && address === app.activeWallet.get("address")) return new Handlebars.SafeString("You");
	if (!app.friends || !app.wallets) return new Handlebars.SafeString(address);

	const search = { address, syncNode: app.syncNode };
	const label = app.friends.findWhere(search) || app.wallets.findWhere(search);

	return new Handlebars.SafeString((label ? label.get("label") : address) || address);
});

if (window.__agent) {
	window.__agent.start(Backbone, Marionette);
}

Marionette.Behaviors.behaviorsLookup = function() {
	return window.Behaviors;
};