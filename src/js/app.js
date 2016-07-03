import "./plugins";
import Backbone from "backbone";
import $ from "jquery";

import Application from "./application/application";

import UnsupportedBrowserTemplate from "./modal/template-unsupported-browser.hbs";
import Modal from "./modal/modal";

import LoginModal from "./modal/modal-login";

let app = new Application();
export default app;

if (!localStorage) {
	app.layout.modals.show(new (Modal.extend({
		dialog: UnsupportedBrowserTemplate,
		title: "Unsupported Browser",

		topCloseButton: false,
		closeButton: false,
		hideFooter: true,

		extraData: {
			feature: "Local Storage"
		},

		beforeCancel() {
			return false;
		}
	}))());
}

Backbone.history.start({pushState: true});

$(document).on("click", "a:not([data-bypass])", function (e) {
	let href = $(this).attr("href");
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