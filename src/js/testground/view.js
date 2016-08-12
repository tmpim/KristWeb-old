import Backbone from "backbone";
import {LayoutView} from "backbone.marionette";
import template from "./template.hbs";
import Radio from "backbone.radio";

import Modal from "../modal/modal";

import TestModal from "../modal/test/modal";
import LoginModal from "../modal/login/modal";

import Wallet from "../wallet/model";

import app from "../app.js";

let walletChannel = Radio.channel("wallet");
let appChannel = Radio.channel("global");

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

	initialize() {
		walletChannel.on("wallet:activeChanged", () => {
			if (this.isDestroyed) {
				return;
			}

			this.render();
		});

		appChannel.on("syncNode:changed", () => {

		});
	},

	templateHelpers: {
		syncNode() {
			return app.syncNode;
		},

		activeWallet() {
			return app.activeWallet;
		}
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
		let s = "abcdefghijklmnopqrstuvwxyz0123456789";

		let wallet = new Wallet({
			label: "Test",
			address: "k" + new Array(9).join().split(",").map(function() { return s.charAt(Math.floor(Math.random() * s.length)); }).join("")
		});

		app.wallets.add(wallet);

		wallet.save();
	},

	onClickButtonSync() {
		app.wallets.models.forEach(model => {
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