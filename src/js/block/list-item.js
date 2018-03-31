import {ItemView} from "backbone.marionette";
import template from "./list-item.hbs";

export default ItemView.extend({
	template: template,
	tagName: "li",
	className: "list-block",

	modelEvents: {
		"change": "render"
	},

	serialiseData() {
		return {
			height: this.model.get("height"),
			address: this.model.get("address"),
			hash: this.model.get("hash"),
			short_hash: this.model.get("short_hash"),
			value: this.model.get("value"),
			time: this.model.get("time"),
			difficulty: this.model.get("difficulty")
		};
	},

	templateHelpers: {
		krist(number) {
			return Number(number).toLocaleString() + " KST";
		},

		formatHeight(number) {
			return Number(number).toLocaleString();
		}
	},

	onAttach() {
		this.$("time").timeago();
	},

	onRender() {
		this.$("time").timeago();
	}
});