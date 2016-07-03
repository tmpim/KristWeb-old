import Backbone from "backbone";
import {LayoutView} from "backbone.marionette";
import template from "./template.hbs";

import Modal from "../modal/modal";

import TestModal from "../modal/modal-test";
import LoginModal from "../modal/modal-login";

import Wallet from "../wallet/model";

import app from "../app.js";

export default LayoutView.extend({
	template: template,
	className: "overview",

	ui: {
		button1: "#b1",
		button2: "#b2",
		button3: "#b3",
		button4: "#b4",
		buttonSync: "#sync",
		buttonFetch: "#fetch",
		buttonClearLocalStorage: "#clearLocalStorage"
	},

	triggers: {
		"click @ui.button1": "click:button1",
		"click @ui.button2": "click:button2",
		"click @ui.button3": "click:button3",
		"click @ui.button4": "click:button4",
		"click @ui.buttonSync": "click:buttonSync",
		"click @ui.buttonFetch": "click:buttonFetch",
		"click @ui.buttonClearLocalStorage": "click:buttonClearLocalStorage"
	},

	onClickButton1() {
		app.layout.modals.show(new TestModal());
	},

	onClickButton2() {
		app.layout.modals.show(new LoginModal());
	},

	onClickButton3() {
		app.layout.modals.show(new (LoginModal.extend({
			extraData: {
				firstTime: true
			}
		}))());
	},

	onClickButton4() {
		let wallet = new Wallet({
			label: "Test",
			address: "kre3w0i79j"
		});

		app.wallets.add(wallet);

		wallet.save();
	},

	onClickButtonSync() {
		app.wallets.models.forEach(function(model) {
			model.save();
		});
	},

	onClickButtonFetch() {
		app.wallets.fetch();
	},

	onClickButtonClearLocalStorage() {
		localStorage.clear();

		app.layout.modals.show(new (Modal.extend({
			title: "Cool",
			dialog: "LocalStorage was cleared"
		}))());
	}
});