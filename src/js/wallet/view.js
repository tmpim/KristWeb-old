import {ItemView} from "backbone.marionette";
import template from "./template.hbs";

import AddWalletModel from "../modal/add-wallet/modal";
import ConfirmModal from "../modal/confirm/modal";

import app from "../app";

import Radio from "backbone.radio";

let walletChannel = Radio.channel("wallet");

export default ItemView.extend({
	template: template,
	className: "wallet-chooser-wallet",

	ui: {
		edit: ".wallet-control-edit",
		remove: ".wallet-control-remove"
	},

	triggers: {
		"click @ui.edit": "click:edit",
		"click @ui.remove": "click:remove",
		"click": "click:this"
	},

	modelEvents: {
		change: "render"
	},

	onRender() {
		this.$el.attr("data-id", this.model.get("id"));
	},

	onShow() {
		this.$el.attr("data-id", this.model.get("id"));

		if (app.activeWallet && app.activeWallet == this.model) {
			this.$el.addClass("active");
		} else {
			this.$el.removeClass("active");
		}
	},

	serializeData() {
		return {
			address: this.model.get("address"),
			label: this.model.get("label"),
			icon: this.model.get("icon"),
			username: this.model.get("username"),
			format: this.model.get("format"),
			active: app.activeWallet && app.activeWallet == this.model,
			balance: this.model.get("balance")
		};
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
				if (app.activeWallet && app.activeWallet == self.model) {
					walletChannel.trigger("wallet:activeRemoved");
				}

				self.model.destroy();
			}
		}))());
	},

	onClickThis() {
		app.switchWallet(this.model);
	}
});
