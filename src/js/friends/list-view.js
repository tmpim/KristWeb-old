import {CollectionView} from "backbone.marionette";
import FriendView from "./friend-view";

import Sortable from "sortablejs";

export default CollectionView.extend({
	initialize(options = {}) {
		this.container = options.container;
	},

	childView: FriendView,

	viewComparator: "position",

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
		this.initSortable();
	},

	onRender() {
		this.initSortable();
	}
});