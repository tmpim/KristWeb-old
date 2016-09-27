import {ItemView} from "backbone.marionette";
import template from "./name-template.hbs";

export default ItemView.extend({
	template: template,
	tagName: "li",
	className: "name",

	modelEvents: {
		"change": "render"
	},

	serializeData() {
		return {
			name: this.model.get("name"),
			owner: this.model.get("owner"),
			a: this.model.get("a"),
			registered: this.model.get("registered"),
			updated: this.model.get("updated"),
			transferred: this.model.get("registered") !== this.model.get("updated")
		};
	},

	onAttach() {
		this.$("time").timeago();
	},

	onRender() {
		this.$("time").timeago();
	}
});