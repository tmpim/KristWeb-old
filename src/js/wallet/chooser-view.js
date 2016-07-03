import {CollectionView} from "backbone.marionette";
import WalletView from "./view";

export default CollectionView.extend({
	initialize(options = {}) {
		this.container = options.container;
	},

	childView: WalletView,
	className: "nano-content",

	collectionEvents: {
		all: "render",
		sync: "render"
	},

	onDomRefresh() {
		this.container.$el.nanoScroller({
			flash: true
		});
	}
});