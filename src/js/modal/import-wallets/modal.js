import _ from "lodash";

import app from "../../app";

import ImportWalletsModalTemplate from "./template.hbs";
import ImportWalletsModalButtons from "./buttons.hbs";

import Modal from "./../modal";
import Wallet from "../../wallet/model.js";
import Friend from "../../friends/model.js";

export default Modal.extend({
	dialog: ImportWalletsModalTemplate,
	buttons: ImportWalletsModalButtons,

	title: "Import Wallets",

	onShow() {
		this.$("#wallets-code-file-import").change(() => {
			const file = this.$("#wallets-code-file-import")[0].files[0];
			const reader = new FileReader();
			reader.readAsText(file, "UTF-8");
			reader.onload = e =>	this.$("#wallets-code").val(e.target.result);
		});
	},

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

		let rawData, plainData, data;
		try {
			rawData = this.$el.find("#wallets-code").val();
			plainData = window.atob(rawData);
			data = JSON.parse(plainData);
		} catch (err) {
			e.preventDefault();
			console.error(err);
			this.$el.find("#code-label").removeClass("label-hidden").addClass("text-red").text("Code is invalid.");
			return false;			
		}

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

		try {
			_.forOwn(data.wallets, (value, key) => {
				if (!key.startsWith("Wallet-")) return;

				let walletData = JSON.parse(window.CryptoJS.AES.decrypt(value, pass).toString(window.CryptoJS.enc.Utf8));
				let wallet = new Wallet(walletData);
				app.wallets.add(wallet);
				wallet.save();
			});

			_.forOwn(data.friends, (value, key) => {
				if (!key.startsWith("Friend-")) return;

				let friendData = JSON.parse(window.CryptoJS.AES.decrypt(value, pass).toString(window.CryptoJS.enc.Utf8));
				let friend = new Friend(friendData);
				app.friends.add(friend);
				friend.save();
			});
		} catch (err) {
			e.preventDefault();
			console.error(err);
			this.$el.find("#code-label").removeClass("label-hidden").addClass("text-red").text("Data is invalid.");
			return false;			
		}
	}
});