import {AppRouter} from "backbone.marionette";

import SidebarService from "./sidebar/service";

import OverviewView from "./overview/view";
import TestGroundView from "./testground/view";
import FriendsView from "./friends/view";
import StorageView from "./settings/storage/view";

export default AppRouter.extend({
	routes: {
		"": "testground",
		"testground": "testground",
		"overview": "overview",
		"addressbook": "friends",
		"friends": "friends",
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

	friends() {
		this.container.show(new FriendsView());

		SidebarService.request("activate", {
			key: "friends"
		});
	},

	storage() {
		this.container.show(new StorageView());

		SidebarService.request("activate", {
			key: "settings"
		});
	}
});