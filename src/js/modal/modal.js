
import template from "./template.hbs";
import Backbone from "backbone";
import _ from "lodash";

export default Backbone.Modal.extend({
	template: template,
	cancelEl: ".modal-close",
	submitEl: ".modal-submit",

	closeButton: true,
	topCloseButton: true,

	serializeData(data) {
		data = data || {};

		data.title = this.title || "";
		data.topCloseButton = this.topCloseButton;
		data.closeButton = this.closeButton;
		data.hideFooter = this.hideFooter;
		data = _.merge(data, this.extraData);

		if (this.buttons) {
			if (typeof this.buttons === "function") {
				data.buttons = this.buttons(data);
			} else {
				data.buttons = this.buttons;
			}
		}

		if (this.dialog) {
			if (typeof this.dialog === "function") {
				data.content = this.dialog(data);
			} else {
				data.content = this.dialog;
			}
		}

		return data;
	}
});