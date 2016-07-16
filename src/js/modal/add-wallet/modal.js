import AddWalletModalTemplate from "./template.hbs";
import AddWalletModalButtons from "./buttons.hbs";

import HelpWalletFormatsTemplate from "./../help/wallet-formats.hbs";

import Modal from "./../modal";
import WalletIconModal from "./../wallet-icon/modal";

import app from "../../app.js";
import Krist from "../../utils/krist.js";
import Wallet from "../../wallet/model.js";

export default Modal.extend({
	dialog: AddWalletModalTemplate,
	buttons: AddWalletModalButtons,

	title: "Add Wallet",

	events: {
		"click .wallet-format-help": "walletFormatHelp",
		"click #wallet-icon": "changeIcon"
	},

	walletFormatHelp() {
		app.layout.modals.show(new (Modal.extend({
			dialog: HelpWalletFormatsTemplate,
			title: "Help: Wallet Formats"
		}))());
	},

	changeIcon() {
		let self = this;

		app.layout.modals.show(new (WalletIconModal.extend({
			success(imageData) {
				self.icon = imageData;

				self.$("#wallet-icon").text("").css("background-image", `url(${self.icon})`);
			},

			removeIcon() {
				self.icon = null;
				self.$("#wallet-icon").text("Icon").css("background-image", "");
			}
		}))());
	},

	onShow() {
		this.$("#wallet-format").select2({
			minimumResultsForSearch: Infinity
		});

		this.$("#wallet-format").on("select2:select", () => {
			let val = this.$("#wallet-format").val();

			if (val === "kristwallet_username_appendhashes" || val === "kristwallet_username") {
				this.$("#wallet-username").removeClass("u-hidden");
				this.$("#wallet-username-label").removeClass("u-hidden");
			} else {
				this.$("#wallet-username").addClass("u-hidden");
				this.$("#wallet-username-label").addClass("u-hidden");
			}
		});
	},

	submit() {
		function sha256(a) {
			return window.CryptoJS.SHA256(a).toString();
		}

		let label = this.$("#wallet-label").val();
		let password = this.$("#wallet-password").val();
		let username = this.$("#wallet-username").val();
		let format = this.$("#wallet-format").val();
		let icon = this.icon;

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
			default:
				masterkey = password;
		}

		let address = Krist.makeV2Address(masterkey);

		let wallet = new Wallet({
			address: address,
			label: label,
			icon: icon,
			username: username,
			password: password,
			format: format
		});

		app.wallets.add(wallet);
		wallet.save();
	}
});