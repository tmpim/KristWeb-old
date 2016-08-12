import $ from "jquery";

import {LayoutView} from "backbone.marionette";
import template from "./template.hbs";

import Transaction from "./model";
import TransactionOverview from "./overview/view";

import AlertView from "../alert/view";
import GetErrorText from "../utils/errors";

import NProgress from "nprogress";

import app from "../app";

export default LayoutView.extend({
	template: template,
	className: "transaction",

	regions: {
		overview: "#overview"
	},

	ui: {
		gotoTransaction: "#goto-transaction",
		gotoTransactionGo: "#goto-transaction-go"
	},

	triggers: {
		"click @ui.gotoTransactionGo": "goto:transaction"
	},

	initialize(options) {
		this.transaction = options.transaction;

		NProgress.start();

		let self = this;

		new Transaction({ id: this.transaction }).fetch({
			success(model, response) {
				if (!response || !response.ok) {
					NProgress.done();
					console.error(response);

					return self.overview.show(new AlertView({
						title: "Error",
						text: GetErrorText(response),
						style: "red"
					}));
				}

				self.overview.show(new TransactionOverview({
					model: model
				}));

				NProgress.done();
			},

			error(response) {
				NProgress.done();
				console.error(response);

				return self.overview.show(new AlertView({
					title: "Error",
					text: GetErrorText(response),
					style: "red"
				}));
			}
		});
	},

	onGotoTransaction() {
		app.router.navigate(`transaction/${this.ui.gotoTransaction.val()}`, { trigger: true });
	}
});