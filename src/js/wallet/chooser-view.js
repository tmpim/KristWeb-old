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
	},

	_onCollectionRemove(model) {
		let view = this.children.findByModel(model);

		view.$el.animate({
			"margin-right": "-" + view.$el.width() + "px",
			"opacity": 0
		}, 500, () => {
			this.removeChildView(view);
			this.checkEmpty();
		});
	}
});