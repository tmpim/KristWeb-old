import $ from "jquery";

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
		"click @ui.send": "click:send"
	},

	regions: {
		overview: "#overview",
		recipientContainer: "#recipient-container"
	},

	initialize() {
		if (app.sendKristTo) {
			this.sendKristTo = app.sendKristTo;
			app.sendKristTo = null;
		}

		appChannel.on("syncNode:changed", () => {
			if (!this.isDestroyed) this.render();
		});
	},

	onRender() {
		this.recipientView = new RecipientContainer({
			sendKristTo: this.sendKristTo
		});

		this.recipientContainer.show(this.recipientView);
	},

	onClickSend() {
		let recipient = this.$el.find("#recipient").val();

		if (!recipient || !/^(?:[a-f0-9]{10}|k[a-z0-9]{9}|[a-z0-9]{1,64}\.kst)$/.test(recipient)) {
			this.$("#recipient-label").removeClass("label-hidden").addClass("text-red").text("Invalid address.");

			return;
		} else {
			this.$("#recipient-label").addClass("label-hidden").removeClass("text-red");
		}

		let amount = parseInt(this.$el.find("#amount").val());

		if (!amount || amount <= 0) {
			this.$("#amount-label").removeClass("label-hidden").addClass("text-red").text("Invalid amount.");

			return;
		} else {
			this.$("#amount-label").addClass("label-hidden").removeClass("text-red");
		}

		let metadata = this.$el.find("#metadata").val().substring(0, 255) || null;

		let self = this;

		NProgress.start();

		$.ajax({
			method: "post",
			url: `${app.syncNode}/transactions`,
			data: {
				to: recipient,
				amount: amount,
				metadata: metadata,
				privatekey: app.activeWallet.get("masterkey")
			},
			dataType: "json"
		}).done(response => {
			if (!response || !response.ok) {
				NProgress.done();
				console.error(response);

				return self.overview.show(new AlertView({
					title: "Error",
					text: GetErrorText(response),
					style: "red"
				}));
			}

			app.activeWallet.boundAddress.fetch();

			NProgress.done();

			self.overview.show(new AlertView({
				title: "Success",
				text: `Successfully sent ${amount.toLocaleString()} KST to ${recipient}.`,
				style: "green"
			}));
		}).fail(response => {
			NProgress.done();
			console.error(response);

			return self.overview.show(new AlertView({
				title: "Error",
				text: GetErrorText(response),
				style: "red"
			}));
		});
	}
});