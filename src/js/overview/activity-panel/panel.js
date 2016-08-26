import {CompositeView} from "backbone.marionette";
import template from "./template.hbs";

import ActivityItemView from "./activity-view";

export default CompositeView.extend({
	template: template,
	className: "panel",

	childView: ActivityItemView,
	childViewContainer: "#activity-list",

	collectionEvents: {
		sort: "render"
	}
});