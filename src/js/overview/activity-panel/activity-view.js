import {ItemView} from "backbone.marionette";
import template from "./activity-template.hbs";

import app from "../../app";

export default ItemView.extend({
	template: template,
	tagName: "li",
	className: "activity-transaction",

	modelEvents: {
		"change": "render"
	},

	serializeData() {
		return {
			id: this.model.get("id"),
			from: this.model.get("from"),
			to: this.model.get("to"),
			value: this.model.get("value") || 0,
			time: this.model.get("time"),
			name: this.model.get("name"),
			metadata: this.model.get("metadata"),
			in: this.model.get("to") === app.activeWallet.boundAddress.get("address")
		};
	},

	templateHelpers: {
		krist(number) {
			return Number(number).toLocaleString() + " KST";
		}
	},

	onAttach() {
		this.$("time").timeago();
	},

	onRender() {
		this.$("time").timeago();
	}
});