import {LayoutView} from "backbone.marionette";
import template from "./pay-template.hbs";

import Transaction from "./model";

import RecipientContainer from "./recipient-container";

import AlertView from "../alert/view";
import GetErrorText from "../utils/errors";

import NProgress from "nprogress";
import Radio from "backbone.radio";

import app from "../app";

let appChannel = Radio.channel("global");

export default LayoutView.extend({
	template: template,
	id: "make-transaction",

	ui: {
		send: "#transaction-send"
	},

	triggers: {
		"click @ui.send": "send"
	},

	regions: {
		recipientContainer: "#recipient-container"
	},

	initialize() {
		appChannel.on("syncNode:changed", () => {
			if (!this.isDestroyed) this.render();
		});
	},

	onRender() {
		this.recipientView = new RecipientContainer();

		this.recipientContainer.show(this.recipientView);
	},

	send() {
		if (!/^(?:[a-f0-9]{10}|k[a-z0-9]{9})$/.test(this.$el.find("#friend-address").val())) {
			this.$("#friend-address-label").removeClass("label-hidden").addClass("text-red").text("Invalid address.");

			return false;
		} else {
			this.$("#friend-address-label").addClass("label-hidden").removeClass("text-red");
		}
	}
});