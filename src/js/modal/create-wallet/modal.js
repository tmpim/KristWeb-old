import CreateWalletModalTemplate from "./template.hbs";
import CreateWalletModalButtons from "./buttons.hbs";

import HelpWalletFormatsTemplate from "./../help/wallet-formats.hbs";
import HelpSyncNodesTemplate from "./../help/sync-nodes.hbs";

import Modal from "./../modal";
import WalletIconModal from "./../wallet-icon/modal";

import app from "../../app";
import Krist from "../../utils/krist.js";
import Wallet from "../../wallet/model.js";

import password from "rand-password-gen";
import Clipboard from "clipboard";
import NProgress from "nprogress";
import zxcvbn from "zxcvbn";

export default Modal.extend({
	dialog: CreateWalletModalTemplate,
	buttons: CreateWalletModalButtons,

	title: "Create Wallet",

	extraData: {
		editing: false
	},

	events: {
		"click #wallet-password-reload": "generatePassword",
		"click .wallet-format-help": "walletFormatHelp",
		"click .sync-node-help": "syncNodeHelp",
		"click #wallet-icon": "changeIcon"
	},

	walletFormatHelp() {
		app.layout.modals.show(new (Modal.extend({
			dialog: HelpWalletFormatsTemplate,
			title: "Help: Wallet Formats"
		}))());
	},

	generatePassword() {
		this.$("#wallet-password").val(password({
			length: 32,
			// exclude some characters that have the possibility to break some badly-programmed forms
			// underscores are excluded because some browsers don't render them properly
			exclusions: ["_", " ", "\"", "'", "\\", "%"]
		})); 
	},

	syncNodeHelp() {
		app.layout.modals.show(new (Modal.extend({
			dialog: HelpSyncNodesTemplate,
			title: "Help: Sync Nodes"
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
		this.generatePassword();

		setTimeout(() => {
			new Clipboard("#wallet-password-copy");
		}, 200);
	},

	submit() {
		NProgress.start();

		function sha256(a) {
			return window.CryptoJS.SHA256(a).toString();
		}

		let label = this.$("#wallet-label").val().substring(0, 30);
		let password = this.$("#wallet-password").val();
		let syncNode = this.$("#wallet-syncnode").val();
		let saveWallet = this.$("#wallet-save input[type=checkbox]").is(":checked");
		let icon = this.icon;

		let masterkey = sha256("KRISTWALLET" + password) + "-000";
		let address = Krist.makeV2Address(masterkey);

		NProgress.set(0.5);

		let wallet = new Wallet({
			address: address,
			label: label,
			icon: icon,
			password: password,
			masterkey: masterkey,
			syncNode: syncNode,
			format: "kristwallet",
			position: app.wallets.length
		});

		app.wallets.add(wallet);
		wallet.save();		
		app.switchWallet(wallet);

		NProgress.done();
	}
});