import {LayoutView} from "backbone.marionette";
import template from "./list-template.hbs";

import BlockCollection from "./collection-paginated";

import BlockListView from "./list-collectionview";
import PaginationView from "../paginator/paginator";

import NetworkFooter from "../network-footer/view";

import NProgress from "nprogress";
import Radio from "backbone.radio";

let walletChannel = Radio.channel("wallet");

export default LayoutView.extend({
	template: template,
	className: "block-list",

	regions: {
		overview: "#overview",
		blockList: "#block-list",
		paginationContainer: "#pagination-container",
		networkFooter: "#network-footer"
	},

	initialize(options) {
		let self = this;

		NProgress.start();

		self.blocks = new BlockCollection(null, {
			lowest: options.lowest
		});

		self.blocks.fetch({
			success() {
				NProgress.done();
				if (!self.isDestroyed) self.render();
			}
		});
	},

	onRender() {
		if (this.blocks) {
			this.blockList.show(new BlockListView({
				collection: this.blocks
			}));

			this.paginationContainer.show(new PaginationView({
				collection: this.blocks
			}));
		}

		this.networkFooter.show(new NetworkFooter());
	}
});