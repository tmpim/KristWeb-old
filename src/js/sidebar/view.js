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
	},

	onRender() {
		setTimeout((() => {
			this.$(".sidebar-item-container").mCustomScrollbar({
				scrollInertia: 500,
				theme: "dark"
			});
		}).bind(this), 250);
	}
});