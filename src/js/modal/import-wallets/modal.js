import _ from "lodash";

import app from "../../app";

import ImportWalletsModalTemplate from "./template.hbs";
import ImportWalletsModalButtons from "./buttons.hbs";

import Modal from "./../modal";
import Wallet from "../../wallet/model.js";

import NProgress from "nprogress";

export default Modal.extend({
	dialog: ImportWalletsModalTemplate,
	buttons: ImportWalletsModalButtons,

	title: "Import Wallets",

	beforeSubmit(e) {
		if (!this.$el.find("#master-password").val()) {
			e.preventDefault();
			this.$el.find("#password-label").removeClass("label-hidden").addClass("text-red").text("Field is required.");

			return false;
		} else {
			this.$el.find("#password-label").addClass("label-hidden").removeClass("text-red");
		}

		if (!this.$el.find("#wallets-code").val()) {
			e.preventDefault();
			this.$el.find("#code-label").removeClass("label-hidden").addClass("text-red").text("Field is required.");

			return false;
		} else {
			this.$el.find("#code-label").addClass("label-hidden").removeClass("text-red");
		}

		let rawData = this.$el.find("#wallets-code").val();
		let plainData = window.atob(rawData);
		let data = JSON.parse(plainData);

		let pass = this.$el.find("#master-password").val();

		let salt = data.salt;
		let tester = data.tester;

		let errored = false;

		try {
			var result = window.CryptoJS.AES.decrypt(tester, pass).toString(window.CryptoJS.enc.Utf8);
		} catch (e) {
			errored = true;
		}

		if (result !== salt || errored) {
			e.preventDefault();
			this.$el.find("#password-label").removeClass("label-hidden").addClass("text-red").text("Wallet password is incorrect.");

			return false;
		}
	},

	submit() {
		NProgress.start();

		let rawData = this.$el.find("#wallets-code").val();
		let plainData = window.atob(rawData);
		let data = JSON.parse(plainData);

		let pass = this.$el.find("#master-password").val();

		_.forOwn(data.wallets, (value, key) => {
			if (!key.startsWith("Wallet-")) return;

			try {
				let walletData = JSON.parse(window.CryptoJS.AES.decrypt(value, pass).toString(window.CryptoJS.enc.Utf8));
				let wallet = new Wallet(walletData);
				app.wallets.add(wallet);
				wallet.save();
			} catch (e) {
				console.error(e);
			}
		});

		NProgress.done();
	}
});