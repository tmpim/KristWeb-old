import LoginWalletModalTemplate from "./template.hbs";
import LoginWalletModalButtons from "./buttons.hbs";

import HelpWalletFormatsTemplate from "./../help/wallet-formats.hbs";
import HelpSyncNodesTemplate from "./../help/sync-nodes.hbs";

import Modal from "./../modal";
import WalletIconModal from "./../wallet-icon/modal";

import app from "../../app";
import Krist from "../../utils/krist.js";
import Wallet from "../../wallet/model.js";
import NProgress from "nprogress";

export default Modal.extend({
	dialog: LoginWalletModalTemplate,
	buttons: LoginWalletModalButtons,

	title: "One-time Wallet Login",

	events: {
		"click .wallet-format-help": "walletFormatHelp",
		"click .sync-node-help": "syncNodeHelp"
	},

	walletFormatHelp() {
		app.layout.modals.show(new (Modal.extend({
			dialog: HelpWalletFormatsTemplate,
			title: "Help: Wallet Formats"
		}))());
	},

	syncNodeHelp() {
		app.layout.modals.show(new (Modal.extend({
			dialog: HelpSyncNodesTemplate,
			title: "Help: Sync Nodes"
		}))());
	},

	beforeSubmit(e) {
		if (!this.$el.find("#wallet-password").val()) {
			e.preventDefault();
			this.$el.find("#wallet-password-label").removeClass("label-hidden").addClass("text-red").text("Field is required.");

			return false;
		} else {
			this.$el.find("#wallet-password-label").addClass("label-hidden").removeClass("text-red");
		}

		let format = this.$("#wallet-format").val();

		if (format === "kristwallet_username_appendhashes" || format === "kristwallet_username") {
			if (!this.$el.find("#wallet-username").val()) {
				e.preventDefault();
				this.$el.find("#wallet-username-label").removeClass("label-hidden").addClass("text-red").text("Field is required.");

				return false;
			} else {
				this.$el.find("#wallet-username-label").addClass("label-hidden").removeClass("text-red");
			}
		}
	},

	onShow() {
		if (app.epic) {
			this.$("#wallet-format").append("<option value=\"jwalelset\">jwalelset</option>");
			this.$("#wallet-format").val("jwalelset");
		}

		let self = this;

		this.$("#wallet-format").selectize({
			create: true,

			onChange() {
				let val = self.$("#wallet-format").val();

				if (val === "kristwallet_username_appendhashes" || val === "kristwallet_username") {
					self.$("#wallet-username").removeClass("u-hidden");
					self.$("#wallet-username-label").removeClass("u-hidden");
				} else {
					self.$("#wallet-username").addClass("u-hidden");
					self.$("#wallet-username-label").addClass("u-hidden");
				}
			}
		});
	},

	submit() {
		NProgress.start();

		function sha256(a) {
			return window.CryptoJS.SHA256(a).toString();
		}

		let password = this.$("#wallet-password").val();
		let username = this.$("#wallet-username").val();
		let format = this.$("#wallet-format").val();
		let syncNode = this.$("#wallet-syncnode").val();

		let masterkey = "";

		switch (format) {
			case "kristwallet":
				masterkey = sha256("KRISTWALLET" + password) + "-000";
				break;
			case "kristwallet_username_appendhashes":
				masterkey = sha256("KRISTWALLETEXTENSION" + sha256(sha256(username) + "^" + sha256(password))) + "-000";
				break;
			case "kristwallet_username":
				masterkey = sha256(sha256(username) + "^" + sha256(password));
				break;
			case "jwalelset": // memes
				masterkey = sha256(sha256(sha256(sha256(sha256(sha256(sha256(sha256(sha256(sha256(sha256(sha256(sha256(sha256(sha256(sha256(sha256(sha256(password))))))))))))))))));
				break;
			default:
				masterkey = password;
		}

		let address = Krist.makeV2Address(masterkey);

		NProgress.set(0.5);

		app.switchWallet(new Wallet({
			address: address,
			username: username,
			password: password,
			masterkey: masterkey,
			syncNode: syncNode,
			format: format
		}));

		NProgress.done();
	}
});