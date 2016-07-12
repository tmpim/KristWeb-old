import {CollectionView} from "backbone.marionette";
import WalletView from "./view";

export default CollectionView.extend({
	initialize(options = {}) {
		this.container = options.container;
	},

	childView: WalletView,

	collectionEvents: {
		all: "render",
		sync: "render"
	}
});