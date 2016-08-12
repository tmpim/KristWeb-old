import {LayoutView} from "backbone.marionette";
import template from "./template.hbs";

import app from "../app.js";
import WalletOverview from "./wallet-overview/view";
import MOTDPanel from "./motd-panel/panel";
import ActivityPanel from "./activity-panel/panel";
import NetworkPanel from "./network-panel/panel";

import NProgress from "nprogress";

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
	},

	templateHelpers: {
		syncNode() {
			return app.syncNode;
		},

		activeWallet() {
			return app.activeWallet;
		}
	},

	onShow() {
		this.overview.show(new WalletOverview());
		this.motdPanel.show(new MOTDPanel());
		this.activityPanel.show(new ActivityPanel());
		this.networkPanel.show(new NetworkPanel());
	}
});