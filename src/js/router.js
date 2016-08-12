import {AppRouter} from "backbone.marionette";

import SidebarService from "./sidebar/service";

import OverviewView from "./overview/view";
import TestGroundView from "./testground/view";
import FriendsView from "./friends/view";
import AddressView from "./address/view";
import TransactionView from "./transaction/view";
import BlockView from "./block/view";
import StorageView from "./settings/storage/view";

export default AppRouter.extend({
	routes: {
		"": "overview",
		"testground": "testground",
		"overview": "overview",
		"addressbook": "friends",
		"friends": "friends",
		"address/:address": "address",
		"transaction/:transaction": "transaction",
		"block/:block": "block",
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

	address(address) {
		this.container.show(new AddressView({
			address: address
		}));

		SidebarService.request("deactivate");
	},

	transaction(transaction) {
		this.container.show(new TransactionView({
			transaction: transaction
		}));

		SidebarService.request("deactivate");
	},

	block(block) {
		this.container.show(new BlockView({
			block: block
		}));

		SidebarService.request("deactivate");
	},

	storage() {
		this.container.show(new StorageView());

		SidebarService.request("activate", {
			key: "settings"
		});
	}
});