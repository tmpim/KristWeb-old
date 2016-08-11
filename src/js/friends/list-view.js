import {CollectionView} from "backbone.marionette";
import Radio from "backbone.radio";

import Sortable from "sortablejs";

import FriendView from "./friend-view";

import app from "../app";

let friendChannel = Radio.channel("friend");

export default CollectionView.extend({
	initialize(options = {}) {
		this.container = options.container;

		friendChannel.on("friendsList:activeChanged", friend => {
			if (this.isDestroyed) return;

			this.render();
		});
	},

	childView: FriendView,

	viewComparator: "position",

	filter(child, index, collection) {
		return child.get("syncNode") === app.syncNode;
	},

	collectionEvents: {
		sort: "render"
	},

	initSortable() {
		let self = this;

		let sortable = new Sortable(this.el, {
			scroll: true,

			onEnd() {
				let order = sortable.toArray();

				for (let i = 0; i < order.length; i++) {
					self.collection.get(order[i]).set("position", i);
					self.collection.get(order[i]).save();
				}
			}
		});

		this.sortable = sortable;
	},

	onAttach() {
		console.log("Friends/list-view attach");

		this.initSortable();
	},

	onRender() {
		console.log("Friends/list-view render");

		this.initSortable();
	}
});