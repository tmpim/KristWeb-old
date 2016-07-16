import "./plugins";
import _ from "lodash";
import Backbone from "backbone";

import Application from "./application/application";

import UnsupportedBrowserTemplate from "./modal/unsupported-browser/template.hbs";
import Modal from "./modal/modal";

import LoginModal from "./modal/login/modal";
// import AddWalletModel from "./modal/add-wallet/modal";

let app = new Application();
export default app;

let feelingIll = false;
let features = {
	"Local Storage"() {
		return localStorage;
	},

	"File APIs"() {
		return window.File && window.FileReader && window.FileList && window.Blob;
	}
};

_.forOwn(features, (value, key) => {
	if (feelingIll) return;

	if (!value()) {
		feelingIll = true;

		app.layout.modals.show(new (Modal.extend({
			dialog: UnsupportedBrowserTemplate,
			title: "Unsupported Browser",

			topCloseButton: false,
			closeButton: false,
			hideFooter: true,

			extraData: {
				feature: key
			},

			beforeCancel() {
				return false;
			}
		}))());
	}
});

if (feelingIll) {
	// eslint-disable-next-line no-undef
	throw up; // ha ha
}

Backbone.history.start({pushState: true});

window.$(document).on("click", "a:not([data-bypass])", function (e) {
	let href = window.$(this).attr("href");
	let protocol = this.protocol + "//";

	if (href && protocol && href.slice(protocol.length) !== protocol) {
		e.preventDefault();

		app.router.navigate(href, true);
	}
});

function passwordReady() {
	app.passwordReady();
}

if (localStorage.tester) {
	app.layout.modals.show(new (LoginModal.extend({
		extraData: {
			firstTime: false
		},

		topCloseButton: false,
		closeButton: false,

		beforeCancel() {
			return false;
		},

		success: passwordReady
	}))());
} else {
	app.layout.modals.show(new (LoginModal.extend({
		extraData: {
			firstTime: true
		},

		topCloseButton: false,
		closeButton: false,

		beforeCancel() {
			return false;
		},

		success: passwordReady
	}))());
}