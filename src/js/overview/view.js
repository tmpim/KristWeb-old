import {LayoutView} from "backbone.marionette";
import template from "./template.hbs";

import app from "../app";

import WalletOverview from "./wallet-overview/view";
import MOTDPanel from "./motd-panel/panel";
import ActivityPanel from "./activity-panel/panel";
import NetworkPanel from "./network-panel/panel";

import NetworkFooter from "../network-footer/view";

import Transaction from "../transaction/model";
import ActivityCollection from "./activity-panel/activity-collection";

import Radio from "backbone.radio";

let walletChannel = Radio.channel("wallet");

export default LayoutView.extend({
	template: template,
	className: "overview",

	regions: {
		overview: "#overview",
		motdPanel: "#motd-panel",
		activityPanel: "#activity-panel",
		networkPanel: "#network-panel",
		networkFooter: "#network-footer"
	},

	ui: {
		httpsAlert: "#https-alert"
	},

	initialize() {
		walletChannel.on("wallet:activeChanged", () => {
			if (!this.isDestroyed) this.render();

			let self = this;

			app.activeWallet.activityCollection = new ActivityCollection();
			app.activeWallet.activityCollection.fetch({
				success() {
					if (!self.isDestroyed) self.render();
				}
			});
		});

		walletChannel.on("wallet:transaction", transaction => {
			app.activeWallet.activityCollection.pop();
			app.activeWallet.activityCollection.add(new Transaction(transaction), { at: 0 });
		});
	},

	templateHelpers: {
		syncNode() {
			return app.syncNode;
		},

		activeWallet() {
			return app.activeWallet;
		}
	},

	onRender() {
		if (app.activeWallet && app.activeWallet.boundAddress) {
			this.overview.show(new WalletOverview({
				model: app.activeWallet.boundAddress
			}));

			if (app.activeWallet.activityCollection) {
				this.activityPanel.show(new ActivityPanel({
					collection: app.activeWallet.activityCollection
				}));
			} else {
				let self = this;

				app.activeWallet.activityCollection = new ActivityCollection();
				app.activeWallet.activityCollection.fetch({
					success() {
						if (!self.isDestroyed) self.render();
					}
				});
			}
		}

		this.motdPanel.show(new MOTDPanel());
		this.networkPanel.show(new NetworkPanel());
		this.networkFooter.show(new NetworkFooter());
	}
});