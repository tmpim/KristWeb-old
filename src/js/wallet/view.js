import {ItemView} from "backbone.marionette";
import template from "./template.hbs";

import AddWalletModel from "../modal/add-wallet/modal";
import ConfirmModal from "../modal/confirm/modal";

import app from "../app";

export default ItemView.extend({
	template: template,
	className: "wallet",

	ui: {
		edit: ".wallet-control-edit",
		remove: ".wallet-control-remove"
	},

	triggers: {
		"click @ui.edit": "click:edit",
		"click @ui.remove": "click:remove"
	},

	onClickEdit() {
		app.layout.modals.show(new (AddWalletModel.extend({
			extraData: {
				editing: true
			},

			model: this.model
		}))());
	},

	onClickRemove() {
		let self = this;

		app.layout.modals.show(new (ConfirmModal.extend({
			title: "Remove Wallet",
			extraData: {
				text: "Are you sure you want to remove this wallet?",
				bad: true
			},

			submit() {
				self.model.destroy();
			}
		}))());
	}
});