import {ItemView} from "backbone.marionette";
import template from "./template.hbs";

import app from "../../app.js";

export default ItemView.extend({
	template: template,
	id: "block-overview",

	modelEvents: {
		"all": "render"
	},

	serializeData() {
		return {
			height: this.model.get("height"),
			address: this.model.get("address"),
			hash: this.model.get("hash"),
			short_hash: this.model.get("short_hash"),
			value: this.model.get("value") || 0,
			time: this.model.get("time"),
			difficulty: this.model.get("difficulty")
		};
	},

	templateHelpers: {
		krist(number) {
			return Number(number).toLocaleString() + " KST";
		},

		localise(number) {
			return Number(number).toLocaleString();
		}
	},

	onAttach() {
		this.$("#block-time").timeago();
	},

	onRender() {
		this.$("#block-time").timeago();
	}
});