import AddFriendModalTemplate from "./template.hbs";
import AddFriendModalButtons from "./buttons.hbs";

import HelpWalletFormatsTemplate from "./../help/wallet-formats.hbs";
import HelpSyncNodesTemplate from "./../help/sync-nodes.hbs";

import Modal from "./../modal";
import WalletIconModal from "./../wallet-icon/modal";

import app from "../../app.js";
import Friend from "../../wallet/model.js";
import NProgress from "nprogress";

export default Modal.extend({
	dialog: AddFriendModalTemplate,
	buttons: AddFriendModalButtons,

	title: "Add Contact",

	events: {
		"click #friend-icon": "changeIcon"
	},

	changeIcon() {
		let self = this;

		app.layout.modals.show(new (WalletIconModal.extend({
			success(imageData) {
				self.icon = imageData;

				self.$("#friend-icon").text("").css("background-image", `url(${self.icon})`);
			},

			removeIcon() {
				self.icon = null;
				self.$("#friend-icon").text("Icon").css("background-image", "");
			}
		}))());
	},

	submit() {
		NProgress.start();

		let label = this.$("#friend-label").val();
		let address = this.$("#friend-address").val();
		let icon = this.icon;

		let friend = new Friend({
			address: address,
			label: label,
			icon: icon,
			position: app.friends.length,
			syncNode: app.syncNode
		});

		app.friends.add(friend);
		friend.save();

		NProgress.done();
	}
});