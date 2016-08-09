import {AppRouter} from "backbone.marionette";

import SidebarService from "./sidebar/service";

import OverviewView from "./overview/view";
import TestGroundView from "./testground/view";
import StorageView from "./settings/storage/view";

export default AppRouter.extend({
	routes: {
		"": "testground",
		"testground": "testground",
		"overview": "overview",
		"settings/storage": "storage"
	},

	initialize(options = {}) {
		this.container = options.container;
	},

	testground() {
		this.container.show(new TestGroundView());

		SidebarService.request("activate", {
			key: "testground"
		});
	},

	overview() {
		this.container.show(new OverviewView());

		SidebarService.request("activate", {
			key: "overview"
		});
	},

	storage() {
		this.container.show(new StorageView());

		SidebarService.request("activate", {
			key: "settings"
		});
	}
});