import {AppRouter} from "backbone.marionette";

import SidebarService from "./sidebar/service";

import OverviewView from "./overview/view";
import TestGroundView from "./testground/view";
import FriendsView from "./friends/view";
import EconomiconView from "./economicon/view";
import RichlistView from "./economicon/richlist/view";
import AddressView from "./address/view";
import PayView from "./transaction/pay-view";
import TransactionListView from "./transaction/list-view";
import NameListView from "./name/list-view";
import NameView from "./name/view";
import TransactionView from "./transaction/view";
import BlockView from "./block/view";

import SettingsStorageView from "./settings/storage/view";
import SettingsNotificationView from "./settings/notifications/view";

export default AppRouter.extend({
	routes: {
		"": "overview",
		"testground(/)": "testground",
		"overview(/)": "overview",
		"addressbook(/)": "friends",
		"friends(/)": "friends",
		"economicon(/)": "economicon",
		"economicon/rich(list)(/)": "richlist",
		"address(es)/:address": "address",
		"address(es)/:address/transaction(s)(/)": "transaction",
		"address(es)/:address/name(s)(/)": "names",
		"transaction(s)(/)": "ownTransactions",
		"transaction(s)/make": "pay",
		"transaction(s)/:transaction": "transaction",
		"block(s)/:block": "block",
		"name(s)(/)": "ownNames",
		"name(s)/:name": "name",
		"settings/storage": "settingsStorage",
		"settings/notifications": "settingsNotifications"
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

	economicon() {
		this.container.show(new EconomiconView());

		SidebarService.request("activate", {
			key: "economicon"
		});
	},

	richlist() {
		this.container.show(new RichlistView());

		SidebarService.request("activate", {
			key: "economicon"
		});
	},

	address(address) {
		this.container.show(new AddressView({
			address: address
		}));

		SidebarService.request("deactivate");
	},

	pay() {
		this.container.show(new PayView());

		SidebarService.request("activate", {
			key: "transactions"
		});
	},

	ownTransactions() {
		this.container.show(new TransactionListView());

		SidebarService.request("activate", {
			key: "transactions"
		});
	},

	transaction(transaction) {
		if (/^(?:[a-f0-9]{10}|k[a-z0-9]{9}|[a-z0-9]{1,64}\.kst|all)$/.test(transaction)) {
			this.container.show(new TransactionListView({
				target: transaction
			}));
		} else {
			this.container.show(new TransactionView({
				transaction: transaction
			}));
		}

		SidebarService.request("activate", {
			key: "transactions"
		});
	},

	ownNames() {
		this.container.show(new NameListView());

		SidebarService.request("activate", {
			key: "names"
		});
	},

	names(address) {
		this.container.show(new NameListView({
			target: address
		}));

		SidebarService.request("activate", {
			key: "names"
		});
	},

	name(name) {
		if (/^(?:[a-f0-9]{10}|k[a-z0-9]{9}|[a-z0-9]{1,64}\.kst|all)$/.test(name)) {
			this.container.show(new NameListView({
				target: name
			}));
		} else {
			this.container.show(new NameView({
				name: name
			}));
		}

		SidebarService.request("activate", {
			key: "names"
		});
	},

	block(block) {
		this.container.show(new BlockView({
			block: block
		}));

		SidebarService.request("activate", {
			key: "economicon"
		});
	},

	settingsStorage() {
		this.container.show(new SettingsStorageView());

		SidebarService.request("activate", {
			key: "settings"
		});
	},

	settingsNotifications() {
		this.container.show(new SettingsNotificationView());

		SidebarService.request("activate", {
			key: "settings"
		});
	}
});