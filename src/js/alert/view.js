import {LayoutView} from "backbone.marionette";
import template from "./template.hbs";

export default LayoutView.extend({
	template: template,
	className: "alert",

	initialize(options) {
		this.title = options.title;
		this.text = options.text;
		this.$el.addClass(options.style);
	},

	serializeData() {
		return {
			title: this.title,
			text: this.text
		};
	}
});