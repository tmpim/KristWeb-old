import {CompositeView} from "backbone.marionette";
import template from "./template.hbs";

import NameItemView from "./name-view";

export default CompositeView.extend({
	template: template,
	className: "panel",

	initialize(options) {
		this.address = options.address;
	},

	childView: NameItemView,
	childViewContainer: "#name-list",

	collectionEvents: {
		sort: "render"
	},

	serializeData() {
		return {
			address: this.address
		};
	}
});