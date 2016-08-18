import {LayoutView} from "backbone.marionette";
import template from "./list-template.hbs";

import Address from "../address/model";
import Transaction from "../transaction/model";
import TransactionCollection from "./collection-paginated";

import TransactionListView from "./list-collectionview";
import WalletOverview from "../overview/wallet-overview/view";
import PaginationView from "../paginator/paginator";

import AlertView from "../alert/view";
import GetErrorText from "../utils/errors";

import app from "../app";

import NProgress from "nprogress";
import Radio from "backbone.radio";

let walletChannel = Radio.channel("wallet");

export default LayoutView.extend({
	template: template,
	className: "wallet-transaction-list",

	regions: {
		overview: "#overview",
		walletOverview: "#wallet-overview",
		transactionList: "#transaction-list",
		paginationContainer: "#pagination-container"
	},

	initialize(options) {
		this.target = options.target;

		if (this.target) {
			let self = this;

			NProgress.start();

			new Address({ address: this.target }).fetch({
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

					NProgress.set(0.25);

					self.model = model;

					self.transactions = new TransactionCollection(null, {
						address: self.model.get("address")
					});

					self.transactions.fetch({
						success() {
							NProgress.done();
							if (!self.isDestroyed) self.render();
						}
					});
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
		} else {
			if (app.activeWallet && app.activeWallet.boundAddress) {
				let self = this;

				this.model = app.activeWallet.boundAddress;

				this.transactions = new TransactionCollection(null, {
					address: this.model.get("address")
				});

				this.transactions.fetch({
					success() {
						NProgress.done();
						if (!self.isDestroyed) self.render();
					}
				});
			}
		}

		walletChannel.on("wallet:activeChanged", () => {
			if (this.target) return;

			if (app.activeWallet && app.activeWallet.boundAddress) {
				let self = this;

				this.model = app.activeWallet.boundAddress;

				this.transactions = new TransactionCollection(null, {
					address: this.model.get("address")
				});

				this.transactions.fetch({
					success() {
						NProgress.done();
						if (!self.isDestroyed) self.render();
					}
				});
			}

			if (!this.isDestroyed) this.render();
		});
	},

	onRender() {
		if (this.model) {
			this.walletOverview.show(new WalletOverview({
				model: this.model,
				hideNames: true
			}));

			if (this.transactions) {
				this.transactionList.show(new TransactionListView({
					collection: this.transactions
				}));

				this.paginationContainer.show(new PaginationView({
					collection: this.transactions
				}));
			}
		}
	}
});