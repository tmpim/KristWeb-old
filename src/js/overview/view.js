import $ from "jquery";

import {LayoutView} from "backbone.marionette";
import template from "./template.hbs";

import app from "../app";

import WalletOverview from "./wallet-overview/view";
import MOTDPanel from "./motd-panel/panel";
import ActivityPanel from "./activity-panel/panel";
import NetworkPanel from "./network-panel/panel";

import ActivityCollection from "./activity-panel/activity-collection";

import NProgress from "nprogress";

import Radio from "backbone.radio";

let walletChannel = Radio.channel("wallet");

export default LayoutView.extend({
	template: template,
	className: "overview",

	regions: {
		overview: "#overview",
		motdPanel: "#motd-panel",
		activityPanel: "#activity-panel",
		networkPanel: "#network-panel"
	},

	initialize() {
		walletChannel.on("wallet:activeChanged", () => {
			if (!this.isDestroyed) this.render();

			let self = this;

			this.activityCollection = new ActivityCollection();
			this.activityCollection.fetch({
				success() {
					if (!self.isDestroyed) self.render();

					console.log(self.activityCollection);
				}
			});
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

			if (this.activityCollection) {
				this.activityPanel.show(new ActivityPanel({
					collection: this.activityCollection
				}));
			}
		}

		this.motdPanel.show(new MOTDPanel());
		this.networkPanel.show(new NetworkPanel());
	}
});