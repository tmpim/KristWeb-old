import Service from "backbone.service";
import {Collection} from "backbone";
import View from "./view";

const SidebarService = Service.extend({
	setup(options = {}) {
		this.collection = new Collection();

		this.container = options.container;

		this.request("add", {
			name: "Testing Ground",
			path: "testground",
			key: "testground"
		});

		this.request("add", {
			name: "Overview",
			path: "overview",
			key: "overview"
		});

		this.request("add", {
			name: "Address Book",
			path: "addressbook",
			key: "friends"
		});

		this.request("add", {
			name: "Transactions",
			path: "transactions",
			key: "transactions"
		});

		this.request("add", {
			name: "Economicon",
			path: "economicon",
			key: "economicon"
		});

		this.request("add", {
			name: "Name Manager",
			path: "names",
			key: "names"
		});

		this.request("add", {
			name: "Webhook Manager",
			path: "webhooks",
			key: "webhooks"
		});

		this.request("add", {
			name: "Double Vault",
			path: "doublevault",
			key: "doublevault"
		});

		this.request("add", {
			name: "Settings",
			path: "settings",
			key: "settings"
		});
	},

	start() {
		this.view = new View({ collection: this.collection });
		this.container.show(this.view);
	},

	requests: {
		add: "add",
		remove: "remove",
		activate: "activate"
	},

	add(model) {
		this.collection.add(model);
	},

	remove(model) {
		model = this.collection.findWhere(model);
		this.collection.remove(model);
	},

	activate(model) {
		this.collection.invoke("set", "active", false);

		model = this.collection.findWhere(model);

		if (model) {
			model.set("active", true);
		}
	}
});

export default new SidebarService();