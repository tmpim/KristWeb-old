import {CompositeView} from "backbone.marionette";
import template from "./template.hbs";

import ActivityItemView from "./activity-view";

export default CompositeView.extend({
	template: template,
	className: "panel",

	initialize(options) {
		this.address = options.address;
	},

	childView: ActivityItemView,
	childViewContainer: "#activity-list",

	collectionEvents: {
		sort: "render"
	},

	serializeData() {
		return {
			address: this.address
		};
	}
});