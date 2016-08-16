import {LayoutView} from "backbone.marionette";
import template from "./template.hbs";

export default LayoutView.extend({
	template: template,
	className: "alert",

	ui: {
		closeButton: ".alert-close"
	},

	triggers: {
		"click @ui.closeButton": "click:close"
	},

	initialize(options) {
		this.title = options.title;
		this.text = options.text;
		this.$el.addClass(options.style);
		this.$el.addClass("cf");
		this.hideCloseButton = options.hideCloseButton;
	},

	serializeData() {
		return {
			title: this.title,
			text: this.text,
			hideCloseButton: this.hideCloseButton
		};
	},

	onClickClose() {
		this.destroy();
	}
});