import {history} from "backbone";
import {ItemView} from "backbone.marionette";
import template from "./template.hbs";

export default ItemView.extend({
	template: template,
	tagName: "nav",
	id: "sidebar-content",

	collectionEvents: {
		all: "render"
	},

	templateHelpers() {
		return {
			sidebarItems: this.collection.toJSON()
		};
	}
});