import {LayoutView} from "backbone.marionette";
import template from "./template.hbs";

import RichlistCollection from "./collection";

import RichlistView from "./list-view";

import NProgress from "nprogress";
import Radio from "backbone.radio";

let appChannel = Radio.channel("global");

export default LayoutView.extend({
	template: template,
	className: "economicon-rich-list",

	regions: {
		richList: "#rich-list"
	},

	initialize() {
		let self = this;

		this.collection = new RichlistCollection();
		this.collectionFetched = false;

		this.collection.fetch({
			success() {
				self.collectionFetched = true;

				NProgress.done();
				if (!self.isDestroyed) self.render();
			}
		});

		appChannel.on("syncNode:changed", () => {
			this.collection = new RichlistCollection();
			this.collectionFetched = false;

			this.collection.fetch({
				success() {
					self.collectionFetched = true;

					NProgress.done();
					if (!self.isDestroyed) self.render();
				}
			});
		});
	},

	onRender() {
		if (this.collection && this.collectionFetched) {
			this.richList.show(new RichlistView({
				collection: this.collection
			}));
		}
	}
});