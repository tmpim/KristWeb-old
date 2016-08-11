import {ItemView} from "backbone.marionette";
import template from "./friend-template.hbs";

import ConfirmModal from "../modal/confirm/modal";

import app from "../app";

export default ItemView.extend({
	template: template,
	className: "wallet-chooser-wallet",

	ui: {
		remove: ".wallet-control-remove"
	},

	triggers: {
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
			active: app.activeWallet && app.activeWallet == this.model
		};
	},

	onClickRemove() {
		let self = this;

		app.layout.modals.show(new (ConfirmModal.extend({
			title: "Remove Contact",
			extraData: {
				text: "Are you sure you want to remove this contact?",
				bad: true
			},

			submit() {
				self.model.destroy();
			}
		}))());
	}
});