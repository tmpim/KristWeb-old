import {LayoutView} from "backbone.marionette";
import template from "./list-template.hbs";

import Address from "../address/model";
import NameCollection from "./collection-paginated";

import NameListView from "./list-collectionview";
import WalletOverview from "../overview/wallet-overview/view";
import PaginationView from "../paginator/paginator";

import NetworkFooter from "../network-footer/view";

import AlertView from "../alert/view";
import GetErrorText from "../utils/errors";

import app from "../app";

import NProgress from "nprogress";
import Radio from "backbone.radio";

let walletChannel = Radio.channel("wallet");

export default LayoutView.extend({
	template: template,
	className: "wallet-name-list",

	regions: {
		overview: "#overview",
		walletOverview: "#wallet-overview",
		nameList: "#name-list",
		paginationContainer: "#pagination-container",
		networkFooter: "#network-footer"
	},

	initialize(options) {
		this.target = options.target;

		if (this.target) {
			let self = this;

			NProgress.start();

			if (this.target === "all") {
				self.names = new NameCollection(null, {
					address: "all"
				});

				self.names.fetch({
					success() {
						NProgress.done();
						if (!self.isDestroyed) self.render();
					}
				});
			} else {
				new Address({address: this.target}).fetch({
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

						self.names = new NameCollection(null, {
							address: self.model.get("address")
						});

						self.names.fetch({
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
			}
		} else {
			if (app.activeWallet && app.activeWallet.boundAddress) {
				let self = this;

				this.model = app.activeWallet.boundAddress;

				this.names = new NameCollection(null, {
					address: this.model.get("address")
				});

				this.names.fetch({
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

				this.names = new NameCollection(null, {
					address: this.model.get("address")
				});

				this.names.fetch({
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
			if (this.names) {
				this.walletOverview.show(new WalletOverview({
					model: this.model,
					showAllNamesButton: true,
					nameCount: this.names.state.totalRecords,
					buyName: true
				}));

				this.nameList.show(new NameListView({
					collection: this.names
				}));

				this.paginationContainer.show(new PaginationView({
					collection: this.names
				}));
			}
		} else if (this.target && this.target === "all") {
			if (this.names) {
				this.nameList.show(new NameListView({
					collection: this.names
				}));

				this.paginationContainer.show(new PaginationView({
					collection: this.names
				}));
			}
		}

		this.networkFooter.show(new NetworkFooter());
	}
});