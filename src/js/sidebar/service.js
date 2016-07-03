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
			name: "Settings",
			path: "settings",
			key: "settings"
		});
	},

	start() {
		this.view = new View({ collection: this.collection });
		this.container.show(this.view);

		this.container.$el.nanoScroller();
	},

	requests: {
		add: "add",
		remove: "remove",
		activate: "activate"
	},

	add(model) {
		this.collection.add(model);

		this.container.$el.nanoScroller();
	},

	remove(model) {
		model = this.collection.findWhere(model);
		this.collection.remove(model);

		this.container.$el.nanoScroller();
	},

	activate(model) {
		this.collection.invoke("set", "active", false);

		model = this.collection.findWhere(model);

		if (model) {
			model.set("active", true);
		}

		this.container.$el.nanoScroller();
	}
});

export default new SidebarService();