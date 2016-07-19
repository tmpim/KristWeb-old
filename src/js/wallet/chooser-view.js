import {CollectionView} from "backbone.marionette";
import WalletView from "./view";

import Radio from "backbone.radio";

let walletChannel = Radio.channel("wallet");

export default CollectionView.extend({
	initialize(options = {}) {
		this.container = options.container;

		walletChannel.on("wallet:activeChanged", () => {
			this.render();
		});

		walletChannel.on("wallet:activeChanging", () => {
			this.render();
		});

		walletChannel.on("wallet:activeRemoved", () => {
			this.render();
		});
	},

	childView: WalletView,

	collectionEvents: {
		all: "render",
		sync: "render"
	}
});