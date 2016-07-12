import AddWalletModalTemplate from "./template.hbs";
import AddWalletModalButtons from "./buttons.hbs";

import HelpWalletFormatsTemplate from "./../help/wallet-formats.hbs";

import Modal from "./../modal";
import WalletIconModal from "./../wallet-icon/modal";

import app from "../../app.js";

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
	}
});