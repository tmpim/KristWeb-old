import {ItemView} from "backbone.marionette";
import template from "./template.hbs";

import app from "../../app";

export default ItemView.extend({
	template: template,
	id: "transaction-overview",

	modelEvents: {
		"all": "render"
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
			lastTransaction: this.model.get("id") - 1,
			nextTransaction: this.model.get("id") + 1,
			a: this.model.get("to") === "a",
			toName: this.model.get("to") === "name"
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
		this.$("#transaction-time").timeago();
	},

	onRender() {
		this.$("#transaction-time").timeago();
	}
});